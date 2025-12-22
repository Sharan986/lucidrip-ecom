import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role: "admin" | "customer";
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User, token: string) => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ 
              isLoading: false, 
              error: data.message || "Login failed" 
            });
            return false;
          }

          set({
            user: {
              _id: data._id,
              username: data.username,
              email: data.email,
              phone: data.phone,
              bio: data.bio,
              avatar: data.avatar,
              role: data.role,
              createdAt: data.createdAt,
            },
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch {
          set({ 
            isLoading: false, 
            error: "Network error. Please try again." 
          });
          return false;
        }
      },

      register: async (name: string, email: string, password: string, phone?: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, phone }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ 
              isLoading: false, 
              error: data.message || "Registration failed" 
            });
            return false;
          }

          set({
            user: {
              _id: data._id,
              username: data.username,
              email: data.email,
              role: data.role,
            },
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch {
          set({ 
            isLoading: false, 
            error: "Network error. Please try again." 
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      updateProfile: async (data: Partial<User>) => {
        const token = get().token;
        if (!token) return false;

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_URL}/users/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: data.username,
              email: data.email,
              phone: data.phone,
              bio: data.bio,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            set({ isLoading: false, error: result.message || "Update failed" });
            return false;
          }

          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false,
          }));

          return true;
        } catch {
          set({ isLoading: false, error: "Network error" });
          return false;
        }
      },

      fetchProfile: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            set((state) => ({
              user: {
                ...state.user,
                _id: data._id,
                username: data.username,
                email: data.email,
                phone: data.phone,
                bio: data.bio,
                avatar: data.avatar,
                role: data.role,
                createdAt: data.createdAt,
              },
            }));
          }
        } catch {
          console.error("Failed to fetch profile");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
