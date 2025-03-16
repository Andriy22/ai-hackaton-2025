import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for creating a new employee
 */
export class CreateEmployeeDto {
  /**
   * Employee's first name
   */
  @ApiProperty({
    description: "Employee's first name",
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  /**
   * Employee's last name
   */
  @ApiProperty({
    description: "Employee's last name",
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  /**
   * Employee's birth date
   */
  @ApiProperty({
    description: "Employee's birth date",
    example: '1990-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  /**
   * Employee's position
   */
  @ApiProperty({
    description: "Employee's position",
    example: 'Software Engineer',
  })
  @IsNotEmpty()
  @IsString()
  position: string;
}
