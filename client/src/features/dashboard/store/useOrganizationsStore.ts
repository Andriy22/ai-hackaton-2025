import { create } from 'zustand';
import { Organization } from '../api/types/organization';
import { organizationApi } from '../api/organizationApi';

interface OrganizationsState {
    // State
    organizations: Organization[];
    selectedOrganization: Organization | null;
    isLoading: boolean;
    error: string | null;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };

    // Actions
    fetchOrganizations: (page?: number, limit?: number) => Promise<void>;
    fetchOrganization: (id: string) => Promise<void>;
    createOrganization: (name: string) => Promise<void>;
    updateOrganization: (id: string, name: string) => Promise<void>;
    deleteOrganization: (id: string) => Promise<void>;
    setSelectedOrganization: (organization: Organization | null) => void;
    clearError: () => void;
}

const useOrganizationsStore = create<OrganizationsState>((set, get) => ({
    // Initial state
    organizations: [],
    selectedOrganization: null,
    isLoading: false,
    error: null,
    meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    },

    // Actions
    fetchOrganizations: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await organizationApi.getOrganizations(page, limit);
            set({
                organizations: response.organizations,
                meta: response.meta,
                isLoading: false
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch organizations'
            });
        }
    },

    fetchOrganization: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await organizationApi.getOrganization(id);
            set({
                selectedOrganization: response.organization,
                isLoading: false
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch organization'
            });
        }
    },

    createOrganization: async (name: string) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.createOrganization({ name });
            // Refresh the list after creating
            await get().fetchOrganizations(get().meta.page, get().meta.limit);
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to create organization'
            });
            throw error;
        }
    },

    updateOrganization: async (id: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.updateOrganization(id, { name });
            // Refresh the list after updating
            await get().fetchOrganizations(get().meta.page, get().meta.limit);
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update organization'
            });
            throw error;
        }
    },

    deleteOrganization: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.deleteOrganization(id);
            // Refresh the list after deleting
            await get().fetchOrganizations(get().meta.page, get().meta.limit);
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to delete organization'
            });
            throw error;
        }
    },

    setSelectedOrganization: (organization: Organization | null) => {
        set({ selectedOrganization: organization });
    },

    clearError: () => set({ error: null })
}));

export default useOrganizationsStore;
