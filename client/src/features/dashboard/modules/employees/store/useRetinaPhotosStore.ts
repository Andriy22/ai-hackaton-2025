import { create } from 'zustand';
import { RetinaPhoto, employeeApi } from '../api/employeeApi';
import { toast } from '@/lib/toast';

interface RetinaPhotosState {
  photos: RetinaPhoto[];
  selectedPhoto: RetinaPhoto | null;
  isLoading: boolean;
  error: string | null;
  fetchRetinaPhotos: (organizationId: string, employeeId: string) => Promise<void>;
  uploadRetinaPhoto: (organizationId: string, employeeId: string, file: File) => Promise<void>;
  deleteRetinaPhoto: (organizationId: string, employeeId: string, photoId: string) => Promise<void>;
  setSelectedPhoto: (photo: RetinaPhoto | null) => void;
  clearPhotos: () => void;
  clearError: () => void;
}

const useRetinaPhotosStore = create<RetinaPhotosState>((set, get) => ({
  photos: [],
  selectedPhoto: null,
  isLoading: false,
  error: null,

  fetchRetinaPhotos: async (organizationId: string, employeeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const photos = await employeeApi.getRetinaPhotos(organizationId, employeeId);
      set({ photos, isLoading: false });
    } catch (error) {
      console.error('Error fetching retina photos:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch retina photos', 
        isLoading: false 
      });
    }
  },

  uploadRetinaPhoto: async (organizationId: string, employeeId: string, file: File) => {
    set({ isLoading: true, error: null });
    try {
      const newPhoto = await employeeApi.uploadRetinaPhoto(organizationId, employeeId, file);
      
      // Fetch the blob URL for the new photo
      try {
        const blobUrl = await employeeApi.getRetinaPhotoById(organizationId, employeeId, newPhoto.id);
        newPhoto.blobUrl = blobUrl;
      } catch (error) {
        console.error(`Failed to fetch blob URL for new photo ${newPhoto.id}:`, error);
      }
      
      set(state => ({ 
        photos: [...state.photos, newPhoto],
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error uploading retina photo:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload retina photo', 
        isLoading: false 
      });
    }
  },

  deleteRetinaPhoto: async (organizationId: string, employeeId: string, photoId: string) => {
    set({ isLoading: true, error: null });
    try {
      await employeeApi.deleteRetinaPhoto(organizationId, employeeId, photoId);
      
      // Clean up blob URL if it exists
      const photoToDelete = get().photos.find(photo => photo.id === photoId);
      if (photoToDelete?.blobUrl && photoToDelete.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoToDelete.blobUrl);
      }
      
      set(state => ({ 
        photos: state.photos.filter(photo => photo.id !== photoId),
        selectedPhoto: state.selectedPhoto?.id === photoId ? null : state.selectedPhoto,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error deleting retina photo:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete retina photo', 
        isLoading: false 
      });
    }
  },

  setSelectedPhoto: (photo: RetinaPhoto | null) => {
    set({ selectedPhoto: photo });
  },

  clearPhotos: () => {
    // Clean up all blob URLs before clearing photos
    const { photos } = get();
    photos.forEach(photo => {
      if (photo.blobUrl && photo.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photo.blobUrl);
      }
    });
    
    set({ photos: [], selectedPhoto: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useRetinaPhotosStore;
