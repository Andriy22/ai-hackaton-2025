import { create } from 'zustand';
import { 
  User, 
  UserRole, 
  PaginationParams,
  UserCreateDto,
  UserUpdateDto
} from '../api/types';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../api/userApi';

interface DashboardState {
  // Users state
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Pagination state
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  
  // Filter state
  role: UserRole | null;
  search: string;
  
  // Actions
  fetchUsers: (params?: PaginationParams) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (user: UserCreateDto) => Promise<User>;
  updateUser: (id: string, user: UserUpdateDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setRole: (role: UserRole | null) => void;
  setSearch: (search: string) => void;
  clearSelectedUser: () => void;
  clearError: () => void;
}

const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  
  // Pagination initial state
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  
  // Filter initial state
  role: null,
  search: '',
  
  // Actions
  fetchUsers: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      // Merge store pagination state with passed params
      const { page, limit, role, search } = get();
      const queryParams: PaginationParams = {
        page,
        limit,
        ...params,
      };
      
      if (role) {
        queryParams.role = role;
      }
      
      if (search) {
        queryParams.search = search;
      }
      
      const response = await getUsers(queryParams);
      console.log(response);
      set({
        users: response.users,
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  fetchUserById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const user = await getUserById(id);
      
      set({
        selectedUser: user,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  },
  
  createUser: async (userData: UserCreateDto) => {
    try {
      set({ isLoading: true, error: null });
      
      const user = await createUser(userData);
      
      // Refresh the user list
      await get().fetchUsers();
      
      set({ isLoading: false });
      
      return user;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      throw error;
    }
  },
  
  updateUser: async (id: string, userData: UserUpdateDto) => {
    try {
      set({ isLoading: true, error: null });
      
      const user = await updateUser(id, userData);
      
      // Update the user in the list if it exists
      set(state => ({
        users: state.users.map(u => u.id === id ? user : u),
        selectedUser: state.selectedUser?.id === id ? user : state.selectedUser,
        isLoading: false,
      }));
      
      return user;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await deleteUser(id);
      
      // Remove the user from the list
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
      throw error;
    }
  },
  
  setPage: (page: number) => {
    set({ page });
    get().fetchUsers({ page });
  },
  
  setLimit: (limit: number) => {
    set({ limit, page: 1 }); // Reset to first page when changing limit
    get().fetchUsers({ limit, page: 1 });
  },
  
  setRole: (role: UserRole | null) => {
    set({ role, page: 1 }); // Reset to first page when changing filter
    get().fetchUsers({ page: 1 });
  },
  
  setSearch: (search: string) => {
    set({ search, page: 1 }); // Reset to first page when changing search
    get().fetchUsers({ page: 1 });
  },
  
  clearSelectedUser: () => set({ selectedUser: null }),
  
  clearError: () => set({ error: null }),
}));

export default useDashboardStore;
