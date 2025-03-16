/**
 * Utility functions for handling soft delete operations
 */

/**
 * Creates a where clause that filters out soft-deleted records
 * @param whereClause - The existing where clause (optional)
 * @returns A where clause that includes the deleted: false condition
 */
export function excludeDeleted<T extends Record<string, any>>(
  whereClause?: T,
): T & { deleted: boolean } {
  return {
    ...(whereClause || {}),
    deleted: false,
  } as T & { deleted: boolean };
}

/**
 * Creates a soft delete data object with deleted flag and timestamp
 * @returns Object with deleted flag set to true and current timestamp
 */
export function softDeleteData(): {
  deleted: boolean;
  deletedAt: Date;
  updatedAt: Date;
} {
  const now = new Date();
  return {
    deleted: true,
    deletedAt: now,
    updatedAt: now,
  };
}
