export interface Organization {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrganizationDto {
    name: string;
}

export interface UpdateOrganizationDto {
    name: string;
}

export interface OrganizationResponse {
    organization: Organization;
}

export interface OrganizationsResponse {
    organizations: Organization[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
