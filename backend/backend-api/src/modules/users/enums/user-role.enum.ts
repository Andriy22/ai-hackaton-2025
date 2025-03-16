/**
 * Enum for user roles in the system
 */
export enum UserRole {
  /**
   * Super administrator with full access to all system resources
   */
  SUPER_ADMIN = 'SUPER_ADMIN',
  
  /**
   * Organization administrator with access to organization resources
   */
  ORG_ADMIN = 'ORG_ADMIN',
  
  /**
   * Validator with access to validation functionality
   */
  VALIDATOR = 'VALIDATOR',
}
