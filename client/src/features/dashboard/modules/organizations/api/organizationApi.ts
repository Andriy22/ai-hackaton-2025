import { CreateOrganizationDto, OrganizationResponse, OrganizationsResponse, UpdateOrganizationDto } from '../types/types';
import { api } from '@/features/auth/api/apiInterceptor';

export const organizationApi = {
    async getOrganizations(page: number = 1, limit: number = 10): Promise<OrganizationsResponse> {
        const response = await api(`/organizations?page=${page}&limit=${limit}`);
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to fetch organizations: ${error}`);
        }

        return response.json();
    },

    async getOrganization(id: string): Promise<OrganizationResponse> {
        const response = await api(`/organizations/${id}`);
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to fetch organization: ${error}`);
        }

        return response.json();
    },

    async createOrganization(data: CreateOrganizationDto): Promise<OrganizationResponse> {
        const response = await api(`/organizations`, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create organization: ${error}`);
        }

        return response.json();
    },

    async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<OrganizationResponse> {
        const response = await api(`/organizations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to update organization: ${error}`);
        }

        return response.json();
    },

    async deleteOrganization(id: string): Promise<void> {
        const response = await api(`/organizations/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to delete organization: ${error}`);
        }
    },
};
