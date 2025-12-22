/**
 * Shared TypeScript types for the e-commerce application
 * These types are used across frontend and can be imported from @/types
 */

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  token: string;
  message?: string;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  uniqueId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
  size: string;
  color: string;
  slug?: string;
  stock?: number;
}

// ============================================
// ORDER TYPES
// ============================================

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  addressType?: "home" | "work";
}

export type OrderStatus = 
  | "Processing" 
  | "Shipped" 
  | "Out for Delivery" 
  | "Delivered" 
  | "Cancelled" 
  | "Returned";

export type PaymentStatus = 
  | "Pending" 
  | "Paid" 
  | "Failed" 
  | "Refunded";

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  trackingId?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateData {
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  paymentMethod?: string;
}

// ============================================
// WISHLIST TYPES
// ============================================

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  img: string;
  slug: string;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminProduct extends Product {
  id: string;
  status: "Active" | "Draft" | "Low Stock";
  sku: string;
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

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}
