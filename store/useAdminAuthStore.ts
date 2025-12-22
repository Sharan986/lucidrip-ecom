import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  adminUsername: string | null;
  adminToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminUsername: null,
      adminToken: null,
      isLoading: false,
      error: null,

      adminLogin: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({
              isLoading: false,
              error: data.message || "Invalid admin credentials",
            });
            return false;
          }

          set({
            isAdminAuthenticated: true,
            adminUsername: data.username,
            adminToken: data.token,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to connect to server",
          });
          return false;
        }
      },

      adminLogout: () => {
        set({
          isAdminAuthenticated: false,
          adminUsername: null,
          adminToken: null,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth-storage",
    }
  )
);
