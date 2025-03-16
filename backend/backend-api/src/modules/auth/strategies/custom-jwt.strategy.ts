import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/services/users.service';
import { TokenPayload } from '../interfaces/auth.interface';

/**
 * Custom JWT strategy that can extract tokens from query parameters
 * if they're not found in the Authorization header
 */
@Injectable()
export class CustomJwtStrategy extends PassportStrategy(
  Strategy,
  'custom-jwt',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => {
        // First try to extract from Authorization header
        const headerToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (headerToken) {
          return headerToken;
        }

        // If not found in header, try to extract from query parameters
        const queryToken = req.query.token;
        if (queryToken && typeof queryToken === 'string') {
          return queryToken;
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  /**
   * Validates the JWT token payload and returns the user
   * @param req The request object
   * @param payload The JWT token payload
   * @returns The user without password
   */
  async validate(req: Request, payload: TokenPayload) {
    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
