import { create } from 'zustand';
import { ValidationStatusType } from '../components/ValidationStatus';
import type { ValidationResult, Employee } from '../api/types';
import { validationApi } from '../api/validation';

interface ValidationState {
  file: File | null;
  validationResult: ValidationResult | null;
  employee: Employee | null;
  status: ValidationStatusType;
  error: string | null;

  // Actions
  setFile: (file: File | null) => void;
  resetValidation: () => void;
  validateImage: (organizationId: string) => Promise<void>;
}

const useValidationStore = create<ValidationState>((set, get) => ({
  file: null,
  validationResult: null,
  employee: null,
  status: ValidationStatusType.IDLE,
  error: null,

  setFile: (file) => {
    set({ file });
    // Reset validation data when a new file is selected
    get().resetValidation();
  },

  resetValidation: () => {
    set({
      validationResult: null,
      employee: null,
      error: null,
      status: ValidationStatusType.IDLE
    });
  },

  validateImage: async (organizationId) => {
    const { file } = get();

    if (!file || !organizationId) {
      set({ error: 'File and organization ID are required' });
      return;
    }

    try {
      set({ status: ValidationStatusType.UPLOADING, error: null });

      const result = await validationApi.validateRetinaImage(file, organizationId);
      set({ validationResult: result });

      if (result.matchingEmployeeId) {
        try {
          const employeeData = await validationApi.getEmployeeById(result.matchingEmployeeId);

          console.log('Employee data:', employeeData);

          set({ employee: employeeData });
        } catch (err) {
          console.error('Failed to fetch employee details:', err);
          set({ error: 'Employee found but details could not be retrieved.' });
        }
      }

      set({ status: ValidationStatusType.SUCCESS });
    } catch (err: any) {
      console.error('Validation failed:', err);
      set({
        error: err.message || 'Failed to validate the image. Please try again.',
        status: ValidationStatusType.ERROR
      });
    }
  }
}));

export default useValidationStore;
