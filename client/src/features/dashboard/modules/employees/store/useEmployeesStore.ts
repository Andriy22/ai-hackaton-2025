import { create } from 'zustand';
import { Employee, UpdateEmployeeDto } from '../../organizations/types/types';
import { employeeApi } from '../api';

interface EmployeesState {
  // State
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEmployeeById: (id: string) => Promise<void>;
  updateEmployee: (id: string, data: UpdateEmployeeDto) => Promise<Employee | void>;
  deleteEmployee: (id: string) => Promise<void>;
  clearError: () => void;
}

const useEmployeesStore = create<EmployeesState>((set) => ({
  // Initial state
  selectedEmployee: null,
  isLoading: false,
  error: null,

  // Actions
  fetchEmployeeById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const employee = await employeeApi.getEmployeeById(id);
      set({
        selectedEmployee: employee,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch employee'
      });
    }
  },

  updateEmployee: async (id: string, data: UpdateEmployeeDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await employeeApi.updateEmployee(id, data);
      set({
        selectedEmployee: response.employee,
        isLoading: false
      });
      return response.employee;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update employee'
      });
      throw error;
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await employeeApi.deleteEmployee(id);
      set({
        selectedEmployee: null,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete employee'
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));

export default useEmployeesStore;
