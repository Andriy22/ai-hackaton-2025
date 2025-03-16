import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating an employee
 */
export class UpdateEmployeeDto {
  /**
   * Employee's first name
   */
  @ApiProperty({
    description: "Employee's first name",
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  /**
   * Employee's last name
   */
  @ApiProperty({
    description: "Employee's last name",
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  /**
   * Employee's birth date
   */
  @ApiProperty({
    description: "Employee's birth date",
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  /**
   * Employee's position
   */
  @ApiProperty({
    description: "Employee's position",
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString()
  position?: string;
}
