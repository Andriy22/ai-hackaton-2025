import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Custom JWT authentication guard that uses the custom-jwt strategy
 * This guard can extract tokens from query parameters if they're not found in headers
 */
@Injectable()
export class CustomJwtAuthGuard extends AuthGuard('custom-jwt') {}
