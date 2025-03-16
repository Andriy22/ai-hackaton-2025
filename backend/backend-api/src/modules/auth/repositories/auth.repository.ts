import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

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
    return this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * Deletes a refresh token by its token value
   * @param token The refresh token to delete
   * @returns The deleted refresh token or null if not found
   */
  async deleteRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return await this.prisma.refreshToken.delete({
        where: {
          token,
        },
      });
    } catch (error) {
      // Check if it's a Prisma error with code P2025 (record not found)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        // Record to delete does not exist
        console.log(`Refresh token not found: ${token}`);
        return null;
      }
      throw error;
    }
  }

  async deleteRefreshById(id: string): Promise<RefreshToken | null> {
    try {
      return await this.prisma.refreshToken.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      console.log(`Refresh token not found: ${id}`);
      return null;
    }
  }

  /**
   * Deletes all refresh tokens for a user
   * @param userId The ID of the user
   * @returns The count of deleted tokens
   */
  async deleteAllUserRefreshTokens(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    return { count: result.count };
  }
}
