/**
 * Entity representing validation statistics
 */
export class ValidationStatistics {
  /**
   * Unique identifier for the validation statistic
   */
  id: string;

  /**
   * Organization ID for which validation was performed
   */
  organizationId: string;

  /**
   * Employee ID that was validated (only for successful validations)
   */
  employeeId?: string | null;

  /**
   * Timestamp when validation occurred
   */
  timestamp: Date;

  /**
   * Whether the validation was successful
   */
  isSuccessful: boolean;

  /**
   * Similarity score (only for successful validations)
   */
  similarity?: number | null;
}
