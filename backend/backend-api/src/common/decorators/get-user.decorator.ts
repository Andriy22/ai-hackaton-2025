import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/users/interfaces/user.interface';

/**
 * Parameter decorator to extract the authenticated user from the request
 * 
 * @example
 * // Get the entire user object
 * @GetUser() user: User
 * 
 * @example
 * // Get a specific property from the user object
 * @GetUser('id') userId: string
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    // If no user is found in the request, return null
    if (!user) {
      return null;
    }

    // If data is provided, return the specific property
    return data ? user[data] : user;
  },
);
