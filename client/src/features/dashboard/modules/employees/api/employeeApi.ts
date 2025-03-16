import { Employee, EmployeeResponse, UpdateEmployeeDto } from '../../organizations/types/types';
import { api } from '@/features/auth/api/apiInterceptor';

export interface RetinaPhoto {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  blobUrl?: string;
}

export interface RetinaPhotosResponse {
  photos: RetinaPhoto[];
}

export const employeeApi = {
  async getEmployeeById(employeeId: string): Promise<Employee> {
    const response = await api(`/organizations/employees/${employeeId}`);

    console.log('Employee response:', response);
    
    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 404) {
        throw new Error('Employee not found');
      } else {
        throw new Error(`Failed to fetch employee: ${error}`);
      }
    }

    return response.json();
  },

  async updateEmployee(employeeId: string, data: UpdateEmployeeDto): Promise<EmployeeResponse> {
    const response = await api(`/organizations/employees/${employeeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 404) {
        throw new Error('Employee not found');
      } else {
        throw new Error(`Failed to update employee: ${error}`);
      }
    }

    return response.json();
  },

  async deleteEmployee(employeeId: string): Promise<void> {
    const response = await api(`/organizations/employees/${employeeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 404) {
        throw new Error('Employee not found');
      } else {
        throw new Error(`Failed to delete employee: ${error}`);
      }
    }
  },

  // Retina photo management endpoints
  
  async uploadRetinaPhoto(organizationId: string, employeeId: string, file: File): Promise<RetinaPhoto> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api(`/storage/organizations/${organizationId}/employees/${employeeId}/retinas`, {
      method: 'POST',
      body: formData,
      headers: {
        // Do not set Content-Type here, it will be set automatically with the correct boundary
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload retina photo: ${error}`);
    }

    return response.json();
  },

  async getRetinaPhotos(organizationId: string, employeeId: string): Promise<RetinaPhoto[]> {
    const response = await api(`/storage/organizations/${organizationId}/employees/${employeeId}/retinas`);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch retina photos: ${error}`);
    }

    const photos = await response.json();
    
    // For each photo, fetch its blob URL
    const photosWithBlobUrls = await Promise.all(
      photos.map(async (photo: RetinaPhoto) => {
        try {
          const blobUrl = await this.getRetinaPhotoById(organizationId, employeeId, photo.id);
          return { ...photo, blobUrl };
        } catch (error) {
          console.error(`Failed to fetch blob URL for photo ${photo.id}:`, error);
          return photo;
        }
      })
    );
    
    return photosWithBlobUrls;
  },

  async getRetinaPhotoById(organizationId: string, employeeId: string, retinaId: string): Promise<string> {
    const response = await api(`/storage/organizations/${organizationId}/employees/${employeeId}/retinas/${retinaId}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    console.log('Retina photo URL:', url);
      
    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 404) {
        throw new Error('Retina photo not found');
      } else {
        throw new Error(`Failed to fetch retina photo: ${error}`);
      }
    }
      
    return url;
  },

  async deleteRetinaPhoto(organizationId: string, employeeId: string, retinaId: string): Promise<void> {
    const response = await api(`/storage/organizations/${organizationId}/employees/${employeeId}/retinas/${retinaId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 404) {
        throw new Error('Retina photo not found');
      } else {
        throw new Error(`Failed to delete retina photo: ${error}`);
      }
    }
  },
};
