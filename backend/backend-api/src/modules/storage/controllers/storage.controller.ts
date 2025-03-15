import {
  BadRequestException,
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
import { User, UserRole } from '@prisma/client';
import { Response } from 'express';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { OrganizationEmployeeRetinasDto } from '../dto/organization-employee-retinas.dto';
import { RetinaImageDto } from '../dto/retina-image.dto';
import { BlobStorageService } from '../services/blob-storage.service';

/**
 * Interface for uploaded file to ensure type safety
 */
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
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
    @UploadedFile() file: MulterFile,
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
    @UploadedFile() file: MulterFile,
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
