import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  Post,
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
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { UserRole } from '../../users/enums/user-role.enum';
import { ValidateRetinaImageDto } from '../dto/validate-retina-image.dto';
import { RetinaImageRepository } from '../repositories/retina-image.repository';
import { BlobStorageService } from '../services/blob-storage.service';
import { ValidationReceiverService } from '../services/validation-receiver.service';

/**
 * Interface for uploaded file
 */
interface UploadedFileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  [key: string]: unknown;
}

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
 * Interface for retina validation request
 */
interface RetinaValidationRequest {
  image_path: string;
  employees: Array<{
    employeeId: string;
    documentId: string;
  }>;
  messageId: string;
  originatingInstance?: string;
}

/**
 * Interface for retina validation API response
 */
interface RetinaValidationApiResponse {
  status: string;
  matchingEmployeeId: string | null;
  similarity: number;
  messageId: string;
}

/**
 * Controller for retina image validation operations
 */
@ApiTags('Validation')
@Controller('validation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);
  private readonly retinaAnalyzerApiUrl =
    'https://lumina-secure-retina-analyzer-etf9h4g3dwawamh5.westeurope-01.azurewebsites.net/validate';

  /**
   * Constructor for ValidationController
   * @param blobStorageService - Service for interacting with blob storage
   * @param retinaImageRepository - Repository for retina image operations
   * @param validationReceiverService - Service for receiving validation responses
   * @param organizationsService - Service for organization operations
   * @param httpService - HTTP service for making API requests
   */
  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly retinaImageRepository: RetinaImageRepository,
    private readonly validationReceiverService: ValidationReceiverService,
    private readonly organizationsService: OrganizationsService,
    private readonly httpService: HttpService,
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
    @UploadedFile() file: UploadedFileData,
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

      // Prepare the validation request
      const validationRequest: RetinaValidationRequest = {
        image_path: uploadResult.path,
        employees: employees.map((emp) => ({
          employeeId: emp.employeeId,
          documentId: emp.documentId || '',
        })),
        messageId,
        originatingInstance: process.env.INSTANCE_NAME || 'backend-api',
      };

      // Send HTTP request to the retina analyzer API
      this.logger.log(
        `Sending validation request to retina analyzer API: ${JSON.stringify(
          validationRequest,
        )}`,
      );

      try {
        // Send the validation request to the retina analyzer API
        const response = await this.sendValidationRequest(validationRequest);

        // Return the validation result
        return response;
      } catch (apiError: unknown) {
        const errorMessage =
          apiError instanceof Error ? apiError.message : 'Unknown API error';
        this.logger.error(`Error calling retina analyzer API: ${errorMessage}`);

        return {
          status: 'error',
          message: 'Failed to validate retina image. Please try again later.',
        };
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error validating retina image: ${errorMessage}`);

      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate retina image');
    }
  }

  /**
   * Send a validation request to the retina analyzer API
   * @param validationRequest - The request data to send
   * @returns The validation response
   */
  private async sendValidationRequest(
    validationRequest: RetinaValidationRequest,
  ): Promise<ValidationResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .post<RetinaValidationApiResponse>(
            this.retinaAnalyzerApiUrl,
            validationRequest,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000, // 30 seconds timeout
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`HTTP request error: ${error.message}`);
              return throwError(
                () => new Error(`API request failed: ${error.message}`),
              );
            }),
          ),
      );

      if (!response || !response.data) {
        this.logger.error('No response received from retina analyzer API');
        return {
          status: 'error',
          message: 'Failed to get validation result. Please try again later.',
        };
      }

      const validationResponse = response.data;
      this.logger.log(
        `Received validation response: ${JSON.stringify(validationResponse)}`,
      );

      return {
        status: validationResponse.status,
        matchingEmployeeId: validationResponse.matchingEmployeeId,
        similarity: validationResponse.similarity,
      };
    } catch (error) {
      this.logger.error(`Error in sendValidationRequest: ${error.message}`);
      throw error;
    }
  }
}
