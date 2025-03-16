export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    employees: number;
  };
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

export enum UserRole {
  VALIDATOR = "VALIDATOR",
  SUPER_ADMIN = "SUPER_ADMIN",
  ORG_ADMIN = "ORG_ADMIN"
}

export interface AddUserToOrgDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRoleDto {
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
}

export interface EmployeeResponse {
  employee: Employee;
}

export interface EmployeesResponse {
  employees: Employee[];
}
