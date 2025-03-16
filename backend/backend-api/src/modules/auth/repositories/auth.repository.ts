import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  excludeDeleted,
  softDeleteData,
} from '../../../common/utils/soft-delete.util';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new refresh token for a user
   * @param userId The ID of the user
   * @param token The refresh token
   * @param expiresAt The expiration date of the token
   * @returns The created refresh token
   */
  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Finds a refresh token by its token value
   * @param token The refresh token to find
   * @returns The refresh token or null if not found
   */
  async findRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: excludeDeleted({ token }),
      include: {
        user: true,
      },
    });
  }

  /**
   * Soft deletes a refresh token by its token value
   * @param token The refresh token to delete
   * @returns The soft-deleted refresh token or null if not found
   */
  async deleteRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      const refreshToken = await this.findRefreshTokenByToken(token);
      if (!refreshToken) {
        return null;
      }
      return await this.prisma.refreshToken.update({
        where: { token },
        data: softDeleteData(),
      });
    } catch {
      // Log error but don't expose details
      console.log(`Error soft-deleting refresh token: ${token}`);
      return null;
    }
  }

  /**
   * Soft deletes a refresh token by its ID
   * @param id The ID of the refresh token to delete
   * @returns The soft-deleted refresh token or null if not found
   */
  async deleteRefreshById(id: string): Promise<RefreshToken | null> {
    try {
      return await this.prisma.refreshToken.update({
        where: { id },
        data: softDeleteData(),
      });
    } catch (error) {
      console.error(error);
      console.log(`Refresh token not found: ${id}`);
      return null;
    }
  }

  /**
   * Soft deletes all refresh tokens for a user
   * @param userId The ID of the user
   * @returns The count of soft-deleted tokens
   */
  async deleteAllUserRefreshTokens(userId: string): Promise<{ count: number }> {
    const refreshTokens = await this.prisma.refreshToken.findMany({
      where: excludeDeleted({ userId }),
    });
    let count = 0;
    for (const token of refreshTokens) {
      await this.prisma.refreshToken.update({
        where: { id: token.id },
        data: softDeleteData(),
      });
      count++;
    }
    return { count };
  }
}
