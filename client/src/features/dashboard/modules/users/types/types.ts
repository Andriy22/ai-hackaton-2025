export enum UserRole {
  ADMIN = 'ORG_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  VALIDATOR = 'VALIDATOR'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdateDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role?: UserRole;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  users: T[];
  meta: PaginationMeta;
}

export interface UserResponse {
  user: User;
}
