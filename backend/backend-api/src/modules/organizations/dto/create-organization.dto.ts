import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new organization
 */
export class CreateOrganizationDto {
  /**
   * Name of the organization
   * @example "Acme Corporation"
   */
  @ApiProperty({
    description: 'Name of the organization',
    example: 'Acme Corporation',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;
}
