import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Types
export interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  desc: string;
  positive: boolean;
}

export interface RecentActivity {
  id: string;
  type: string;
  text: string;
  time: string;
  amount: string;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: string;
  items: number;
  date: string;
  payment: string;
}

export interface KPIData {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: "Active" | "Inactive" | "New";
  joinedAt: string;
}

export interface AdminProduct {
  id: string;
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Low Stock";
  img: string;
  sku: string;
}

interface AdminDataState {
  // Dashboard
  dashboardStats: DashboardStat[];
  recentActivity: RecentActivity[];
  recentOrders: RecentOrder[];
  
  // Analytics
  kpiData: KPIData[];
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopProduct[];
  trafficSources: TrafficSource[];
  totalRevenue: number;
  avgMonthlyRevenue: number;
  
  // Customers
  customers: Customer[];
  customerStats: {
    total: number;
    active: number;
    totalSpent: number;
    avgOrderValue: number;
  };
  
  // Products
  products: AdminProduct[];
  productCount: number;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: (token: string) => Promise<void>;
  fetchAnalyticsData: (token: string, range?: string) => Promise<void>;
  fetchCustomers: (token: string) => Promise<void>;
  fetchProducts: (token: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminDataStore = create<AdminDataState>((set) => ({
  // Dashboard
  dashboardStats: [],
  recentActivity: [],
  recentOrders: [],
  
  // Analytics
  kpiData: [],
  monthlyRevenue: [],
  topProducts: [],
  trafficSources: [],
  totalRevenue: 0,
  avgMonthlyRevenue: 0,
  
  // Customers
  customers: [],
  customerStats: {
    total: 0,
    active: 0,
    totalSpent: 0,
    avgOrderValue: 0,
  },
  
  // Products
  products: [],
  productCount: 0,
  
  // Loading states
  isLoading: false,
  error: null,

  fetchDashboardData: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      
      const data = await response.json();
      
      set({
        dashboardStats: data.stats,
        recentActivity: data.recentActivity,
        recentOrders: data.recentOrders,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch dashboard data",
      });
    }
  },

  fetchAnalyticsData: async (token: string, range = "6m") => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/analytics?range=${range}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      
      const data = await response.json();
      
      set({
        kpiData: data.kpiData,
        monthlyRevenue: data.monthlyRevenue,
        topProducts: data.topProducts,
        trafficSources: data.trafficSources,
        totalRevenue: data.totalRevenue,
        avgMonthlyRevenue: data.avgMonthlyRevenue,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch analytics data",
      });
    }
  },

  fetchCustomers: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      
      const data = await response.json();
      
      set({
        customers: data.customers,
        customerStats: data.stats,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch customers",
      });
    }
  },

  fetchProducts: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      const data = await response.json();
      
      set({
        products: data.products,
        productCount: data.count,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch products",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
