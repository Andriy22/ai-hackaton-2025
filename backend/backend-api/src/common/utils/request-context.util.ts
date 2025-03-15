import { ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { User } from '../../modules/users/interfaces/user.interface';

/**
 * Utility class for handling request context operations
 */
export class RequestContextUtil {
  /**
   * Extracts the authenticated user from the request
   * @param context The execution context
   * @returns The authenticated user or null if not found
   */
  static getUser(context: ExecutionContext): User | null {
    const request = context.switchToHttp().getRequest();
    return request.user || null;
  }

  /**
   * Extracts the authenticated user's ID from the request
   * @param context The execution context
   * @returns The authenticated user's ID or null if not found
   */
  static getUserId(context: ExecutionContext): string | null {
    const user = this.getUser(context);
    return user?.id || null;
  }

  static getRole(context: ExecutionContext): UserRole | null {
    const user = this.getUser(context);
    return user?.role || null;
  }
}
