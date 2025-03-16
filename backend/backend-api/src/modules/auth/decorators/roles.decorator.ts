import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';

/**
 * Decorator to specify which roles can access a resource
 * @param roles - The roles that can access the resource
 * @returns Decorator function
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
