import { UserRole } from '@prisma/client';

/**
 * Interface representing a user in the system
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  /**
   * User's first name
   */
  firstName: string;
  /**
   * User's last name
   */
  lastName: string;
  /**
   * User's email address (unique)
   */
  email: string;
  /**
   * User's hashed password
   */
  password: string;
  /**
   * User's role (ADMIN or USER)
   */
  role: UserRole;
  /**
   * Date when the user was created
   */
  createdAt: Date;
  /**
   * Date when the user was last updated
   */
  updatedAt: Date;
}
