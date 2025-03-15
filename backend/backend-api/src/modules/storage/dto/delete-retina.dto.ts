import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * DTO for deleting a retina photo for an employee in an organization
 */
export class DeleteRetinaDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'Employee ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    description: 'Filename of the retina photo to delete',
    example: 'retina_scan_20250315.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
