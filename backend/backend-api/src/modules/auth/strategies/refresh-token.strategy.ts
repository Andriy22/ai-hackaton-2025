import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { UsersService } from '../../users/services/users.service';
import { TokenPayload } from '../interfaces/auth.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  /**
   * Validates the refresh token payload and returns the user with the refresh token
   * @param req The request object
   * @param payload The JWT token payload
   * @returns The user without password and the refresh token
   */
  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from user object
    const { ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      refreshToken,
    };
  }
}
