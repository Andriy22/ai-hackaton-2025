/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import {
  AuthResponse,
  TokenPayload,
  Tokens,
} from '../interfaces/auth.interface';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Authenticates a user and generates tokens
   * @param loginDto User login data
   * @returns Authentication response with user and tokens
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Refreshes the access token using a refresh token
   * @param userId User ID
   * @param refreshToken Refresh token
   * @returns New tokens
   */
  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    // Normalize token by trimming whitespace
    const normalizedToken = refreshToken.trim();

    // Find refresh token in database
    const storedRefreshToken =
      await this.authRepository.findRefreshTokenByToken(normalizedToken);

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token belongs to user
    if (storedRefreshToken.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (new Date() > storedRefreshToken.expiresAt) {
      // Delete expired token
      await this.authRepository.deleteRefreshById(storedRefreshToken.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    // Find user
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Delete old refresh token
    await this.authRepository.deleteRefreshById(storedRefreshToken.id);

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Save new refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Logs out a user by deleting their refresh token
   * @param userId User ID
   * @param refreshToken Refresh token
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    // Normalize token by trimming whitespace
    const normalizedToken = refreshToken.trim();

    // Find refresh token in database
    const storedRefreshToken =
      await this.authRepository.findRefreshTokenByToken(normalizedToken);

    if (!storedRefreshToken) {
      // Token doesn't exist, nothing to do
      return;
    }

    // Check if token belongs to user
    if (storedRefreshToken.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete refresh token
    await this.authRepository.deleteRefreshToken(normalizedToken);
  }

  /**
   * Logs out a user from all devices by deleting all their refresh tokens
   * @param userId User ID
   * @returns The count of deleted tokens
   */
  async logoutAll(userId: string): Promise<{ count: number }> {
    return this.authRepository.deleteAllUserRefreshTokens(userId);
  }

  /**
   * Generates access and refresh tokens for a user
   * @param userId User ID
   * @param email User email
   * @param role User role
   * @returns Access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const payload: TokenPayload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Saves a refresh token to the database
   * @param userId User ID
   * @param refreshToken Refresh token
   * @returns The saved refresh token
   */
  private async saveRefreshToken(userId: string, refreshToken: string) {
    // Calculate expiration date based on JWT_REFRESH_EXPIRATION
    const expirationTime = process.env.JWT_REFRESH_EXPIRATION;
    const expiresIn = this.parseExpirationTime(expirationTime ?? '30m');
    const expiresAt = new Date(Date.now() + expiresIn);

    return this.authRepository.createRefreshToken(
      userId,
      refreshToken,
      expiresAt,
    );
  }

  /**
   * Verifies a password against a hash
   * @param password Plain text password
   * @param hash Hashed password
   * @returns Whether the password is valid
   */
  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Parses an expiration time string (e.g., '15m', '1h', '7d') to milliseconds
   * @param expirationTime Expiration time string
   * @returns Expiration time in milliseconds
   */
  private parseExpirationTime(expirationTime: string): number {
    const unit = expirationTime.slice(-1);
    const value = parseInt(expirationTime.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new BadRequestException('Invalid expiration time format');
    }
  }
}
