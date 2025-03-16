export interface ValidationResult {
  matchingEmployeeId: string | null;
  similarity: number | null;
  message: string | null;
  timestamp: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  organizationId: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationError {
  message: string;
  errors?: Record<string, string[]>;
}
