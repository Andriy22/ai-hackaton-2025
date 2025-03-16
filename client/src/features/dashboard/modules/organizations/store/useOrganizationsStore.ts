import { create } from 'zustand';
import { Organization, UpdateOrganizationDto, CreateOrganizationDto, Employee, AddUserToOrgDto, UpdateUserRoleDto } from '../types/types';
import { organizationApi } from '../api/organizationApi';
import { User } from '../../users/types/types';

interface OrganizationsState {
    // State
    organizations: Organization[];
    selectedOrganization: Organization | null;
    organizationUsers: User[];
    organizationEmployees: Employee[];
    isLoading: boolean;
    isLoadingUsers: boolean;
    isLoadingEmployees: boolean;
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
    createOrganization: (data: CreateOrganizationDto) => Promise<void>;
    updateOrganization: (id: string, data: UpdateOrganizationDto) => Promise<void>;
    deleteOrganization: (id: string) => Promise<void>;
    setSelectedOrganization: (organization: Organization | null) => void;
    clearError: () => void;
    
    // User management
    fetchOrganizationUsers: (organizationId: string) => Promise<void>;
    addUserToOrganization: (organizationId: string, data: AddUserToOrgDto) => Promise<void>;
    removeUserFromOrganization: (organizationId: string, userId: string) => Promise<void>;
    updateUserRole: (organizationId: string, userId: string, data: UpdateUserRoleDto) => Promise<void>;
    
    // Employee management
    fetchOrganizationEmployees: (organizationId: string) => Promise<void>;
    createEmployee: (organizationId: string, data: any) => Promise<void>;
    updateEmployee: (employeeId: string, data: any) => Promise<any>;
    deleteEmployee: (employeeId: string) => Promise<void>;
}

const useOrganizationsStore = create<OrganizationsState>((set, get) => ({
    // Initial state
    organizations: [],
    selectedOrganization: null,
    organizationUsers: [],
    organizationEmployees: [],
    isLoading: false,
    isLoadingUsers: false,
    isLoadingEmployees: false,
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
            const organization = await organizationApi.getOrganization(id);

            set({
                selectedOrganization: organization,
                isLoading: false
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch organization'
            });
        }
    },

    createOrganization: async (data: CreateOrganizationDto) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.createOrganization(data);
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

    updateOrganization: async (id: string, data: UpdateOrganizationDto) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.updateOrganization(id, data);
            // Refresh the list after updating
            await get().fetchOrganizations(get().meta.page, get().meta.limit);
            
            // If we're updating the currently selected organization, refresh it as well
            if (get().selectedOrganization?.id === id) {
                await get().fetchOrganization(id);
            }
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

    setSelectedOrganization: (organization) => {
        set({ selectedOrganization: organization });
    },

    clearError: () => {
        set({ error: null });
    },
    
    // User management implementation
    fetchOrganizationUsers: async (organizationId) => {
        set({ isLoadingUsers: true, error: null });
        try {
            const response = await organizationApi.getOrganizationUsers(organizationId);

            set({
                organizationUsers: response.users,
                isLoadingUsers: false
            });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to fetch organization users', 
                isLoadingUsers: false 
            });
        }
    },
    
    addUserToOrganization: async (organizationId, data) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.addUserToOrganization(organizationId, data);
            // Refresh the users list after adding a new user
            await get().fetchOrganizationUsers(organizationId);
            // Refresh organization to update counts
            await get().fetchOrganization(organizationId);
            set({ isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to add user to organization', 
                isLoading: false 
            });
        }
    },
    
    removeUserFromOrganization: async (organizationId, userId) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.removeUserFromOrganization(organizationId, userId);
            // Refresh the users list after removing a user
            await get().fetchOrganizationUsers(organizationId);
            // Refresh organization to update counts
            await get().fetchOrganization(organizationId);
            set({ isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to remove user from organization', 
                isLoading: false 
            });
        }
    },
    
    updateUserRole: async (organizationId, userId, data) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.updateUserRole(organizationId, userId, data);
            // Refresh the users list after updating a user's role
            await get().fetchOrganizationUsers(organizationId);
            set({ isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to update user role', 
                isLoading: false 
            });
        }
    },
    
    // Employee management implementation
    fetchOrganizationEmployees: async (organizationId) => {
        set({ isLoadingEmployees: true, error: null });
        try {
            const employees = await organizationApi.getEmployees(organizationId);

            set({
                organizationEmployees: employees,
                isLoadingEmployees: false
            });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to fetch organization employees', 
                isLoadingEmployees: false 
            });
        }
    },
    
    createEmployee: async (organizationId, data) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.createEmployee(organizationId, data);
            // Refresh employees list
            await get().fetchOrganizationEmployees(organizationId);
            // Refresh organization to update counts
            await get().fetchOrganization(organizationId);
            set({ isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to create employee', 
                isLoading: false 
            });
            throw error;
        }
    },
    
    updateEmployee: async (employeeId, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await organizationApi.updateEmployee(employeeId, data);
            // Refresh employees list for the organization
            const orgId = get().selectedOrganization?.id;
            if (orgId) {
                await get().fetchOrganizationEmployees(orgId);
                // Refresh organization to update counts
                await get().fetchOrganization(orgId);
            }
            set({ isLoading: false });
            return response;
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to update employee', 
                isLoading: false 
            });
            throw error;
        }
    },
    
    deleteEmployee: async (employeeId) => {
        set({ isLoading: true, error: null });
        try {
            await organizationApi.deleteEmployee(employeeId);
            // Refresh employees list for the organization
            const orgId = get().selectedOrganization?.id;
            if (orgId) {
                await get().fetchOrganizationEmployees(orgId);
                // Refresh organization to update counts
                await get().fetchOrganization(orgId);
            }
            set({ isLoading: false });
        } catch (error: any) {
            set({ 
                error: error.message || 'Failed to delete employee', 
                isLoading: false 
            });
            throw error;
        }
    }
}));

export default useOrganizationsStore;
