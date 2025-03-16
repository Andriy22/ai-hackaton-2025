import { CreateOrganizationDto, Employee, Organization, OrganizationResponse, OrganizationsResponse, UpdateOrganizationDto, AddUserToOrgDto, UpdateUserRoleDto, EmployeeResponse, EmployeesResponse, CreateEmployeeDto, UpdateEmployeeDto } from '../types/types';
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

    async getOrganization(id: string): Promise<Organization> {
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

    // User management endpoints
    
    async getOrganizationUsers(id: string) {
        const response = await api(`/organizations/${id}/users`);
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to fetch organization users: ${error}`);
        }

        return response.json();
    },
    
    async addUserToOrganization(id: string, data: AddUserToOrgDto): Promise<void> {
        const response = await api(`/organizations/${id}/users`, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            
            if (response.status === 404) {
                throw new Error('Organization or user not found');
            } else if (response.status === 409) {
                throw new Error('User already belongs to an organization');
            } else {
                throw new Error(`Failed to add user to organization: ${error}`);
            }
        }
    },

    async removeUserFromOrganization(id: string, userId: string): Promise<void> {
        const response = await api(`/organizations/${id}/users/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.text();
            
            if (response.status === 404) {
                throw new Error('Organization or user not found');
            } else if (response.status === 400) {
                throw new Error('User does not belong to this organization');
            } else {
                throw new Error(`Failed to remove user from organization: ${error}`);
            }
        }
    },

    async updateUserRole(id: string, userId: string, data: UpdateUserRoleDto): Promise<void> {
        const response = await api(`/organizations/${id}/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            
            if (response.status === 404) {
                throw new Error('Organization or user not found');
            } else {
                throw new Error(`Failed to update user role: ${error}`);
            }
        }
    },

    // Employee management endpoints
    
    async createEmployee(id: string, data: CreateEmployeeDto): Promise<EmployeeResponse> {
        const response = await api(`/organizations/${id}/employees`, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            
            if (response.status === 404) {
                throw new Error('Organization not found');
            } else {
                throw new Error(`Failed to create employee: ${error}`);
            }
        }

        return response.json();
    },

    async getEmployees(id: string): Promise<Employee[]> {
        const response = await api(`/organizations/${id}/employees`);
        
        if (!response.ok) {
            const error = await response.text();
            
            if (response.status === 404) {
                throw new Error('Organization not found');
            } else {
                throw new Error(`Failed to fetch employees: ${error}`);
            }
        }

        return response.json();
    },

    async getEmployeeById(employeeId: string): Promise<EmployeeResponse> {
        const response = await api(`/organizations/employees/${employeeId}`);
        
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
};
