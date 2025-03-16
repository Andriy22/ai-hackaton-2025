import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/users/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { OrganizationEmployeeRetinasDto } from '../dto/organization-employee-retinas.dto';
import { RetinaImageDto } from '../dto/retina-image.dto';
import { ValidateRetinaImageDto } from '../dto/validate-retina-image.dto';
import { RetinaImageRepository } from '../repositories/retina-image.repository';
import { BlobStorageService } from '../services/blob-storage.service';
import {
  RetinaValidationCommand,
  ServiceBusService,
} from '../services/service-bus.service';
import { ValidationReceiverService } from '../services/validation-receiver.service';

/**
 * Interface for uploaded file to ensure type safety
 */
interface UploadedFileMetadata {
  /** Original name of the file */
  originalname: string;
  /** MIME type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** Buffer containing the file data */
  buffer: Buffer;
}

/**
 * Interface for retina image response
 */
interface RetinaImageResponse {
  id: string;
  path: string;
  createdAt: Date;
}

@ApiTags('storage')
@Controller('storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly retinaImageRepository: RetinaImageRepository,
    private readonly serviceBusService: ServiceBusService,
    private readonly validationReceiverService: ValidationReceiverService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Get('images/:imageName')
  @ApiOperation({ summary: 'Get an image by name' })
  @ApiResponse({
    status: 200,
    description: 'Image retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async getImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Retrieving image: ${imageName}`);
      const imageBuffer =
        await this.blobStorageService.downloadImage(imageName);

      const contentType = this.getContentTypeFromFileName(imageName);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', imageBuffer.length);
      res.status(HttpStatus.OK).send(imageBuffer);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to retrieve image: ${errorMessage}`);

      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Image ${imageName} not found`);
      }
      throw new InternalServerErrorException('Error retrieving image');
    }
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async uploadImage(
    @UploadedFile() file: UploadedFileMetadata,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      this.logger.log(`Uploading image: ${file.originalname}`);

      const url = await this.blobStorageService.uploadImage(
        file.originalname,
        file.buffer,
        file.mimetype,
      );
      return { url };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload image: ${errorMessage}`);
      throw new InternalServerErrorException('Error uploading image');
    }
  }

  @Post('organizations/:organizationId/employees/:employeeId/retinas')
  @ApiOperation({ summary: 'Upload a retina photo for an employee' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Retina photo uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async uploadRetinaPhoto(
    @Param('organizationId') organizationId: string,
    @Param('employeeId') employeeId: string,
    @UploadedFile() file: UploadedFileMetadata,
    @GetUser() user: User,
  ): Promise<{ url: string; id: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check if user has access to this organization
    await this.checkOrganizationAccess(organizationId, user);

    try {
      this.logger.log(
        `Uploading retina photo for organization ${organizationId}, employee ${employeeId}: ${file.originalname}`,
      );

      const result = await this.blobStorageService.uploadRetinaPhoto(
        organizationId,
        employeeId,
        file.originalname,
        file.buffer,
        file.mimetype,
      );
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload retina photo: ${errorMessage}`);
      throw new InternalServerErrorException('Error uploading retina photo');
    }
  }

  @Get('organizations/:organizationId/employees/:employeeId/retinas')
  @ApiOperation({ summary: 'List all retina photos for an employee' })
  @ApiResponse({
    status: 200,
    description: 'List of retina photos retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async listRetinaPhotos(
    @Param() params: OrganizationEmployeeRetinasDto,
    @GetUser() user: User,
  ): Promise<RetinaImageResponse[]> {
    // Check if user has access to this organization
    await this.checkOrganizationAccess(params.organizationId, user);

    try {
      this.logger.log(
        `Listing retina photos for organization ${params.organizationId}, employee ${params.employeeId}`,
      );

      const retinaPhotos = await this.blobStorageService.listRetinaPhotos(
        params.organizationId,
        params.employeeId,
      );

      if (retinaPhotos.length === 0) {
        throw new NotFoundException('No retina photos found for this employee');
      }

      return retinaPhotos;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to list retina photos: ${errorMessage}`);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error listing retina photos');
    }
  }

  @Get('organizations/:organizationId/employees/:employeeId/retinas/:retinaId')
  @ApiOperation({ summary: 'Get a retina photo for an employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retina photo retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Retina photo not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async getRetinaPhoto(
    @Param() params: RetinaImageDto,
    @Res() res: Response,
    @GetUser() user: User,
  ): Promise<void> {
    // Check if user has access to this organization
    await this.checkOrganizationAccess(params.organizationId, user);

    try {
      this.logger.log(
        `Retrieving retina photo for organization ${params.organizationId}, employee ${params.employeeId}, ID: ${params.retinaId}`,
      );

      const imageBuffer = await this.blobStorageService.downloadRetinaPhotoById(
        params.retinaId,
      );

      const contentType = 'image/jpeg'; // Default to JPEG
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', imageBuffer.length);
      res.status(HttpStatus.OK).send(imageBuffer);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to retrieve retina photo: ${errorMessage}`);

      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(
          `Retina photo with ID ${params.retinaId} not found`,
        );
      }
      throw new InternalServerErrorException('Error retrieving retina photo');
    }
  }

  @Delete(
    'organizations/:organizationId/employees/:employeeId/retinas/:retinaId',
  )
  @ApiOperation({ summary: 'Delete a retina photo for an employee' })
  @ApiResponse({
    status: 200,
    description: 'Retina photo deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Retina photo not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async deleteRetinaPhoto(
    @Param() params: RetinaImageDto,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    // Check if user has access to this organization
    await this.checkOrganizationAccess(params.organizationId, user);

    try {
      this.logger.log(
        `Deleting retina photo for organization ${params.organizationId}, employee ${params.employeeId}, ID: ${params.retinaId}`,
      );

      const deleted = await this.blobStorageService.deleteRetinaPhoto(
        params.retinaId,
      );

      if (!deleted) {
        throw new NotFoundException(
          `Retina photo with ID ${params.retinaId} not found`,
        );
      }

      return {
        message: `Retina photo deleted successfully`,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete retina photo: ${errorMessage}`);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting retina photo');
    }
  }

  /**
   * Validate a retina image against existing employees
   * @param file - The retina image file to validate
   * @param validateDto - The validation request data
   * @returns The validation result
   */
  @Post('validate-retina')
  @ApiOperation({ summary: 'Validate a retina image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        organizationId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Validation successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        matchingEmployeeId: { type: 'string', nullable: true },
        similarity: { type: 'number', nullable: true },
        message: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async validateRetinaImage(
    @GetUser() user: User,
    @UploadedFile() file: any,
    @Body() validateDto: ValidateRetinaImageDto,
  ): Promise<any> {
    try {
      // Get the user from the request
      // const user = this.request['user'];

      // Determine the organization ID
      const organizationId = validateDto.organizationId;

      // If the user is not a super admin and an organization ID is provided, verify access
      if (user && organizationId) {
        const hasAccess =
          user.role === UserRole.SUPER_ADMIN ||
          (await this.organizationsService.checkUserOrganization(
            organizationId,
            user.id,
          ));

        if (!hasAccess) {
          throw new ForbiddenException(
            'You do not have access to this organization',
          );
        }
      }

      // Upload the file to blob storage
      const blobName = `validation/${uuidv4()}-${file.originalname}`;
      const uploadResult = await this.blobStorageService.uploadImage(
        blobName,
        file.buffer,
        file.mimetype,
      );

      if (!uploadResult) {
        throw new InternalServerErrorException(
          'Failed to upload image to blob storage',
        );
      }

      if (!organizationId) {
        throw new BadRequestException('Organization ID is required');
      }

      // Get all employees with retina images for the organization
      const employees =
        await this.retinaImageRepository.findByOrganizationId(organizationId);

      if (!employees || employees.length === 0) {
        return {
          status: 'error',
          message:
            'No employees with retina images found for this organization',
        };
      }

      // Create a unique message ID for this validation request
      const messageId = uuidv4();

      // Prepare the validation command
      const validationCommand: RetinaValidationCommand = {
        image_path: uploadResult,
        employees: employees.map((emp) => ({
          employeeId: emp.employeeId,
          documentId: emp.documentId || '',
        })),
        messageId,
      };

      // Send the command to the service bus
      const sendResult =
        await this.serviceBusService.sendRetinaValidationCommand(
          validationCommand,
        );

      if (!sendResult) {
        throw new InternalServerErrorException(
          'Failed to send validation command to service bus',
        );
      }

      // Wait for the validation response
      const validationResponse =
        await this.validationReceiverService.waitForValidationResponse(
          messageId,
        );

      if (!validationResponse) {
        return {
          status: 'error',
          message: 'Validation timed out. Please try again later.',
        };
      }

      // Return the validation result
      return {
        status: validationResponse.status,
        matchingEmployeeId: validationResponse.matchingEmployeeId,
        similarity: validationResponse.similarity,
      };
    } catch (error) {
      this.logger.error(`Error validating retina image: ${error.message}`);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate retina image');
    }
  }

  /**
   * Checks if the user has access to the specified organization
   * @param organizationId - ID of the organization
   * @param user - User making the request
   * @throws ForbiddenException if the user does not have access to the organization
   */
  private async checkOrganizationAccess(
    organizationId: string,
    user: User,
  ): Promise<void> {
    // Super admins have access to all organizations
    if (user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    // For ORG_ADMIN, check if they belong to the organization
    const hasAccess = await this.organizationsService.checkUserOrganization(
      organizationId,
      user.id,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have permission to access resources for this organization',
      );
    }
  }

  /**
   * Get the content type based on the file extension
   * @param fileName - Name of the file
   * @returns Content type
   */
  private getContentTypeFromFileName(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  }
}
