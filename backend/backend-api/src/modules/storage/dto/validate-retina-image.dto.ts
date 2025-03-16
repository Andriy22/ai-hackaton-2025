import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object for validating a retina image
 */
export class ValidateRetinaImageDto {
  /**
   * Organization ID for the validation request
   */
  @IsOptional()
  @IsString()
  organizationId?: string;
}
