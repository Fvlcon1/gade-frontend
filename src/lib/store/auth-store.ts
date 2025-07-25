import { create } from 'zustand';
import { User, LoginCredentials } from '@/types/auth';
import Cookies from 'universal-cookie';

interface AuthState {
  user: User | null;
  pendingLogin: LoginCredentials | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setPendingLogin: (credentials: LoginCredentials | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const cookies = new Cookies()

// Initialize state from localStorage if available
const getInitialState = () => {
  if (typeof window === 'undefined') return { user: null, pendingLogin: null, isAuthenticated: false };
  
  const storedUser = localStorage.getItem('user');
  const storedPendingLogin = localStorage.getItem('pendingLogin');
  
  let user = null;
  let pendingLogin = null;
  let isAuthenticated = false;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
      isAuthenticated = true;
    } catch (e) {
      console.error('Failed to parse stored user:', e);
      localStorage.removeItem('user');
    }
  }

  if (storedPendingLogin) {
    try {
      pendingLogin = JSON.parse(storedPendingLogin);
    } catch (e) {
      console.error('Failed to parse stored pending login:', e);
      localStorage.removeItem('pendingLogin');
    }
  }

  return { user, pendingLogin, isAuthenticated };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: false,
  error: null,
  sidebarExpanded: false,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null 
    });
  },
  setPendingLogin: (credentials) => {
    if (credentials) {
      localStorage.setItem('pendingLogin', JSON.stringify(credentials));
    } else {
      localStorage.removeItem('pendingLogin');
    }
    set({ pendingLogin: credentials });
  },
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    localStorage.removeItem('pendingLogin');
    // localStorage.removeItem('user');
    cookies.remove('access_token');
    cookies.remove('refresh_token');
    if(typeof window !== 'undefined') window.location.assign("/login")
  },
})); 