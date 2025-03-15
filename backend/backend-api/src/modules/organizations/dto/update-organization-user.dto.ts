import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating a user in an organization
 */
export class UpdateOrganizationUserDto {
  /**
   * User's role in the organization (ORG_ADMIN or VALIDATOR)
   */
  @ApiProperty({
    description: 'User role in the organization',
    enum: UserRole,
    example: UserRole.VALIDATOR,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
