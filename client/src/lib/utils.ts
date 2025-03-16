import { UserRole } from "@/features/dashboard/modules/users/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getReadablUserRole(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "Super Admin";
    case UserRole.ADMIN:
      return "Organization Admin";
    case UserRole.VALIDATOR:
      return "Validator";
    default:
      return "Unknown Role";
  }
}
