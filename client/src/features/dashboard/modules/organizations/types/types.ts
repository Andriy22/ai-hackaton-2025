export interface Organization {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface OrganizationResponse {
  organization: Organization;
}

export interface OrganizationPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrganizationsResponse {
  organizations: Organization[];
  meta: OrganizationPaginationMeta;
}
