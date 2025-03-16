import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * DTO for adding a user to an organization
 */
export class AddOrganizationUserDto {
  /**
   * User's email
   */
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * User's first name
   */
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * User's last name
   */
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * User's password
   */
  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  /**
   * User's role in the organization (ORG_ADMIN, ORG_USER or VALIDATOR)
   */
  @ApiProperty({
    description: 'User role in the organization',
    enum: UserRole,
    example: UserRole.VALIDATOR,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
