import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for updating an organization
 */
export class UpdateOrganizationDto {
  /**
   * Name of the organization
   * @example "Acme Corporation Updated"
   */
  @ApiProperty({
    description: 'Name of the organization',
    example: 'Acme Corporation Updated',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;
}
