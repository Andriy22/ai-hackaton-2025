import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { RetinaImageRepository } from '../repositories/retina-image.repository';
import { ServiceBusService } from './service-bus.service';

/**
 * Service for interacting with Azure Blob Storage
 */
@Injectable()
export class BlobStorageService {
  private readonly logger = new Logger(BlobStorageService.name);
  private readonly containerClient: ContainerClient;

  constructor(
    private readonly retinaImageRepository: RetinaImageRepository,
    private readonly serviceBusService: ServiceBusService,
  ) {
    try {
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
      const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

      if (!connectionString || !containerName) {
        throw new Error(
          'Azure Storage connection string or container name is not defined',
        );
      }

      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      this.containerClient =
        blobServiceClient.getContainerClient(containerName);
      this.logger.log('BlobStorageService initialized successfully');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to initialize BlobStorageService: ${errorMessage}`,
      );
      throw error;
    }
  }

  /**
   * Upload an image to blob storage
   * @param fileName - Name of the file
   * @param fileBuffer - Buffer containing file data
   * @param contentType - MIME type of the file
   * @returns URL of the uploaded image
   */
  async uploadImage(
    fileName: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: { blobContentType: contentType },
      });

      this.logger.log(`Image uploaded successfully: ${fileName}`);
      return blockBlobClient.url;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload image: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Download an image from blob storage
   * @param fileName - Name of the file to download
   * @returns Buffer containing the image data
   */
  async downloadImage(fileName: string): Promise<Buffer> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      const downloadResponse = await blockBlobClient.download(0);

      if (!downloadResponse.readableStreamBody) {
        throw new Error(`Image ${fileName} not found`);
      }

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      const stream = downloadResponse.readableStreamBody;

      return new Promise<Buffer>((resolve, reject) => {
        stream.on('data', (data: Buffer) => {
          chunks.push(data);
        });

        stream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          this.logger.log(`Image downloaded successfully: ${fileName}`);
          resolve(buffer);
        });

        stream.on('error', (error: Error) => {
          this.logger.error(`Error downloading image: ${error.message}`);
          reject(error);
        });
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to download image: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Delete an image from blob storage
   * @param fileName - Name of the file to delete
   * @returns Boolean indicating whether the deletion was successful
   */
  async deleteImage(fileName: string): Promise<boolean> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      const response = await blockBlobClient.deleteIfExists();

      this.logger.log(
        `Image deletion result: ${response.succeeded ? 'successful' : 'not found'}`,
      );
      return response.succeeded;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete image: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Upload a retina photo for an employee and save to database
   * @param organizationId - ID of the organization
   * @param employeeId - ID of the employee
   * @param originalFileName - Original name of the file
   * @param fileBuffer - Buffer containing file data
   * @param contentType - MIME type of the file
   * @returns Object containing the URL and database record ID of the uploaded retina photo
   */
  async uploadRetinaPhoto(
    organizationId: string,
    employeeId: string,
    originalFileName: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<{ url: string; id: string }> {
    try {
      // Generate a unique filename using UUID
      const fileExtension = path.extname(originalFileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;

      // Create the blob path
      const blobPath = this.getRetinaPhotoPath(
        organizationId,
        employeeId,
        uniqueFileName,
      );

      // Upload to blob storage
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobPath);
      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: { blobContentType: contentType },
      });

      // Save record to database
      const retinaImage = await this.retinaImageRepository.create(
        employeeId,
        blobPath,
      );

      // Send command to service bus
      await this.serviceBusService.sendRetinaImageCommand({
        image_path: blobPath,
        employeeId: employeeId,
        imgId: retinaImage.id,
      });

      this.logger.log(`Retina photo uploaded successfully: ${blobPath}`);
      return {
        url: blockBlobClient.url,
        id: retinaImage.id,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload retina photo: ${errorMessage}`);

      // Re-throw as Error type to ensure type safety
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to upload retina photo: ${errorMessage}`);
      }
    }
  }

  /**
   * Download a retina photo by ID
   * @param retinaImageId - ID of the retina image to download
   * @returns Buffer containing the retina photo data
   */
  async downloadRetinaPhotoById(retinaImageId: string): Promise<Buffer> {
    try {
      // Find the retina image in the database
      const retinaImage =
        await this.retinaImageRepository.findById(retinaImageId);
      if (!retinaImage) {
        throw new Error(`Retina image with ID ${retinaImageId} not found`);
      }

      // Download from blob storage
      const blockBlobClient = this.containerClient.getBlockBlobClient(
        retinaImage.path,
      );
      const downloadResponse = await blockBlobClient.download(0);

      if (!downloadResponse.readableStreamBody) {
        throw new Error(`Retina photo not found in storage`);
      }

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      const stream = downloadResponse.readableStreamBody;

      return new Promise<Buffer>((resolve, reject) => {
        stream.on('data', (data: Buffer) => {
          chunks.push(data);
        });

        stream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          this.logger.log(
            `Retina photo downloaded successfully: ${retinaImage.path}`,
          );
          resolve(buffer);
        });

        stream.on('error', (streamError: Error) => {
          this.logger.error(
            `Error downloading retina photo: ${streamError.message}`,
          );
          reject(streamError);
        });
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to download retina photo: ${errorMessage}`);
      // Re-throw as Error type to ensure type safety
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to download retina photo: ${errorMessage}`);
      }
    }
  }

  /**
   * List all retina photos for an employee
   * @param organizationId - ID of the organization
   * @param employeeId - ID of the employee
   * @returns Array of retina image records
   */
  async listRetinaPhotos(
    organizationId: string,
    employeeId: string,
  ): Promise<{ id: string; path: string; createdAt: Date }[]> {
    try {
      // Get retina images from database
      const retinaImages =
        await this.retinaImageRepository.findByEmployeeId(employeeId);

      this.logger.log(
        `Listed ${retinaImages.length} retina photos for organization ${organizationId}, employee ${employeeId}`,
      );

      return retinaImages.map((image) => ({
        id: image.id,
        path: image.path,
        createdAt: image.createdAt,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to list retina photos: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Delete a retina photo for an employee
   * @param retinaImageId - ID of the retina image in the database
   * @returns Boolean indicating whether the deletion was successful
   */
  async deleteRetinaPhoto(retinaImageId: string): Promise<boolean> {
    try {
      // Find the retina image in the database
      const retinaImage =
        await this.retinaImageRepository.findById(retinaImageId);
      if (!retinaImage) {
        this.logger.warn(`Retina image with ID ${retinaImageId} not found`);
        return false;
      }

      // Delete from blob storage
      const blockBlobClient = this.containerClient.getBlockBlobClient(
        retinaImage.path,
      );
      const response = await blockBlobClient.deleteIfExists();

      if (response.succeeded) {
        // Soft delete from database
        await this.retinaImageRepository.delete(retinaImageId);
      }

      this.logger.log(
        `Retina photo deletion result: ${response.succeeded ? 'successful' : 'not found'}`,
      );
      return response.succeeded;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete retina photo: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Upload a blob to storage and return path information
   * @param fileBuffer - Buffer containing file data
   * @param blobName - Name to use for the blob
   * @param contentType - MIME type of the file
   * @returns Object containing success status and path of the uploaded blob
   */
  async uploadBlob(
    fileBuffer: Buffer,
    blobName: string,
    contentType: string,
  ): Promise<{ success: boolean; path: string }> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: { blobContentType: contentType },
      });

      this.logger.log(`Blob uploaded successfully: ${blobName}`);
      return {
        success: true,
        path: blobName,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload blob: ${errorMessage}`);
      return {
        success: false,
        path: '',
      };
    }
  }

  /**
   * Get the path for a retina photo
   * @param organizationId - ID of the organization
   * @param employeeId - ID of the employee
   * @param fileName - Name of the file
   * @returns Path to the retina photo
   */
  private getRetinaPhotoPath(
    organizationId: string,
    employeeId: string,
    fileName: string,
  ): string {
    return `organizations/${organizationId}/employees/${employeeId}/retinas/${fileName}`;
  }
}
