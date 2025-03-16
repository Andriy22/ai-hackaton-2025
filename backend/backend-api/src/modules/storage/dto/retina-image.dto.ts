import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { OrganizationEmployeeRetinasDto } from './organization-employee-retinas.dto';

/**
 * DTO for operations with a specific retina image
 */
export class RetinaImageDto extends OrganizationEmployeeRetinasDto {
  @ApiProperty({
    description: 'Retina Image ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsNotEmpty()
  retinaId: string;
}
