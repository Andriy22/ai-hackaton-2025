import { api } from '@/features/auth/api/apiInterceptor';
import { Employee, ValidationResult, ValidationStatistics } from "./types";

export const validationApi = {
  /**
   * Validates a retina image against the organization's database
   */
  async validateRetinaImage(
    file: File,
    organizationId: string
  ): Promise<ValidationResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('organizationId', organizationId);
  
    const response = await api('/validation/retina', {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to validate retina image");
    }
  
    return response.json();
  },

  /**
   * Fetches employee details by ID
   */
  async getEmployeeById(employeeId: string): Promise<Employee> {
    const response = await api(`/organizations/employees/${employeeId}`, {
      method: "GET",
    });


    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch employee details");
    }
  
    const data = await response.json();
    console.log('Employee data:', data);
    return data;
  },
  
  /**
   * Lists employees for an organization
   */
  async listEmployees(organizationId: string, page = 1, limit = 10): Promise<{ employees: Employee[], total: number }> {
    const response = await api(
      `/employees?organizationId=${organizationId}&page=${page}&limit=${limit}`, 
      {
        method: "GET",
      }
    );
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch employees");
    }
  
    return response.json();
  },

  /**
   * Fetches daily validation statistics for an organization
   */
  async getDailyStatistics(
    startDate: string, 
    endDate: string, 
    organizationId?: string
  ): Promise<ValidationStatistics> {
    let url = `/statistics/daily?startDate=${startDate}&endDate=${endDate}`;
    
    if (organizationId) {
      url += `&organizationId=${organizationId}`;
    }
    
    const response = await api(url, {
      method: "GET",
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch validation statistics");
    }
  
    return response.json();
  }
};

// Re-export types to maintain backward compatibility
export type { DailyStatItem, Employee, ValidationResult, ValidationStatistics } from "./types";

