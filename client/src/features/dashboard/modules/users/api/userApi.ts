import { User, PaginatedResponse, UserCreateDto, UserUpdateDto, PaginationParams } from '../types/types';
import { api } from '@/features/auth/api/apiInterceptor';

/**
 * Get paginated list of users with optional filters
 */
export const getUsers = async (
  params: PaginationParams = {}
): Promise<PaginatedResponse<User>> => {
  const { page = 1, limit = 10, role, search } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (role) {
    queryParams.append('role', role);
  }

  if (search) {
    queryParams.append('search', search);
  }

  const response = await api(`/users?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch users');
  }

  return response.json();
};

/**
 * Get a user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  const response = await api(`/users/${userId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to fetch user with ID: ${userId}`);
  }

  return response.json();
};

/**
 * Creates a new user
 */
export const createUser = async (userData: UserCreateDto): Promise<User> => {
  const response = await api('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
};

/**
 * Updates an existing user
 */
export const updateUser = async (
  userId: string, 
  userData: UserUpdateDto
): Promise<User> => {
  const response = await api(`/users/${userId}`, {
    method: 'PUT', 
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to update user with ID: ${userId}`);
  }

  return response.json();
};

/**
 * Deletes a user
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const response = await api(`/users/${userId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to delete user with ID: ${userId}`);
  }
};
