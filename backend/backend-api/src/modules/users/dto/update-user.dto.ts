/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for updating an existing user
 */
export class UpdateUserDto {
  /**
   * User's first name
   */
  @ApiProperty({
    description: "User's first name",
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  /**
   * User's last name
   */
  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  /**
   * User's email address (must be unique)
   */
  @ApiProperty({
    description: "User's email address (must be unique)",
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * User's password (will be hashed before storage)
   */
  @ApiProperty({
    description: "User's password (will be hashed before storage)",
    example: 'Password123!',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  /**
   * User's role (ADMIN or USER)
   */
  @ApiProperty({
    description: "User's role (ADMIN or USER)",
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
