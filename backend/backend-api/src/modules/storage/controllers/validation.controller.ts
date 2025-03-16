import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { ValidateRetinaImageDto } from '../dto/validate-retina-image.dto';
import { RetinaImageRepository } from '../repositories/retina-image.repository';
import { BlobStorageService } from '../services/blob-storage.service';
import {
  RetinaValidationCommand,
  ServiceBusService,
} from '../services/service-bus.service';
import { ValidationReceiverService } from '../services/validation-receiver.service';

/**
 * Interface for validation response
 */
interface ValidationResponse {
  status: string;
  matchingEmployeeId?: string | null;
  similarity?: number;
  message?: string;
}

/**
 * Controller for retina image validation operations
 */
@ApiTags('Validation')
@Controller('validation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  /**
   * Constructor for ValidationController
   * @param blobStorageService - Service for interacting with blob storage
   * @param retinaImageRepository - Repository for retina image operations
   * @param serviceBusService - Service for interacting with service bus
   * @param validationReceiverService - Service for receiving validation responses
   * @param organizationsService - Service for organization operations
   */
  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly retinaImageRepository: RetinaImageRepository,
    private readonly serviceBusService: ServiceBusService,
    private readonly validationReceiverService: ValidationReceiverService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  /**
   * Validate a retina image against existing employees
   * @param file - The retina image file to validate
   * @param validateDto - The validation request data
   * @returns The validation result
   */
  @Post('retina')
  @ApiOperation({
    summary: 'Validate a retina image against existing employees',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Retina image file to validate',
        },
        organizationId: {
          type: 'string',
          description: 'ID of the organization to validate against',
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
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.VALIDATOR)
  @UseInterceptors(FileInterceptor('file'))
  async validateRetinaImage(
    @UploadedFile() file: any,
    @Body() validateDto: ValidateRetinaImageDto,
  ): Promise<ValidationResponse> {
    try {
      if (!file) {
        return {
          status: 'error',
          message: 'No file uploaded',
        };
      }

      // Determine the organization ID
      const organizationId = validateDto.organizationId;
      if (!organizationId) {
        return {
          status: 'error',
          message: 'Organization ID is required',
        };
      }

      // Upload the file to blob storage
      const blobName = `validation/${uuidv4()}-${file.originalname}`;
      const uploadResult = await this.blobStorageService.uploadBlob(
        file.buffer,
        blobName,
        file.mimetype,
      );

      if (!uploadResult.success) {
        throw new InternalServerErrorException(
          'Failed to upload image to blob storage',
        );
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
        image_path: uploadResult.path,
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
}
