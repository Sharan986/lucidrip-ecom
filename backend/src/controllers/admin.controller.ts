import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Order from "../models/order.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import { generateToken } from "../utils/generateToken";

// Admin credentials from environment variables (secure)
const getAdminCredentials = () => ({
  email: process.env.ADMIN_EMAIL || "",
  password: process.env.ADMIN_PASSWORD || "",
  username: process.env.ADMIN_USERNAME || ""
});

/**
 * @desc    Admin Login - validates credentials from environment variables
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const adminCreds = getAdminCredentials();

    // Validate against environment credentials
    if (username !== adminCreds.username || password !== adminCreds.password) {
      res.status(401).json({ message: "Invalid admin credentials" });
      return;
    }

    // Find or create admin user in database
    let adminUser = await User.findOne({ email: adminCreds.email });

    if (!adminUser) {
      // Create admin user if doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminCreds.password, salt);

      adminUser = await User.create({
        username: adminCreds.username,
        email: adminCreds.email,
        passwordHash: hashedPassword,
        role: "admin",
        phone: ""
      });
    } else if (adminUser.role !== "admin") {
      // Ensure user has admin role
      adminUser.role = "admin";
      await adminUser.save();
    }

    // Generate JWT token
    const token = generateToken(adminUser._id);

    res.status(200).json({
      _id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      token,
      message: "Admin login successful"
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Server Error";
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: errorMessage });
  }
};

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);

    // Today's revenue
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      paymentStatus: "Paid"
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Yesterday's revenue for comparison
    const yesterdayOrders = await Order.find({
      createdAt: { $gte: yesterday, $lt: today },
      paymentStatus: "Paid"
    });
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate trend
    const revenueTrend = yesterdayRevenue > 0 
      ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
      : todayRevenue > 0 ? "+100" : "0";

    // Pending orders count
    const pendingOrders = await Order.countDocuments({ status: "Processing" });
    
    // New customers this week
    const newCustomersThisWeek = await User.countDocuments({
      createdAt: { $gte: thisWeekStart },
      role: "customer"
    });

    // Low stock products (stock < 10)
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    // Recent activity (last 10 orders/events)
    const recentOrders = await Order.find({})
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(10);

    const recentActivity = recentOrders.map(order => ({
      id: order._id,
      type: order.status === "Processing" ? "order" : 
            order.paymentStatus === "Paid" ? "payment" : "order",
      text: `${order.status === "Processing" ? "New order" : order.status === "Delivered" ? "Order delivered" : "Order"} #${order.orderNumber} from ${(order.userId as any)?.username || "Customer"}`,
      time: getTimeAgo(order.createdAt),
      amount: `₹${order.totalAmount.toLocaleString()}`
    }));

    // Recent orders list
    const recentOrdersList = await Order.find({})
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedRecentOrders = recentOrdersList.map(order => ({
      id: order.orderNumber,
      customer: (order.userId as any)?.username || "Customer",
      amount: order.totalAmount.toLocaleString(),
      status: order.status.toUpperCase(),
      items: order.items.length,
      date: formatDate(order.createdAt),
      payment: order.paymentMethod
    }));

    res.status(200).json({
      stats: [
        {
          label: "Today's Revenue",
          value: `₹${todayRevenue.toLocaleString()}`,
          trend: `${Number(revenueTrend) >= 0 ? "+" : ""}${revenueTrend}%`,
          desc: "vs yesterday",
          positive: Number(revenueTrend) >= 0
        },
        {
          label: "Pending Orders",
          value: pendingOrders.toString(),
          trend: `${pendingOrders}`,
          desc: "requires action",
          positive: pendingOrders === 0
        },
        {
          label: "New Customers",
          value: newCustomersThisWeek.toString(),
          trend: `+${newCustomersThisWeek}`,
          desc: "this week",
          positive: true
        },
        {
          label: "Low Stock Items",
          value: lowStockProducts.toString(),
          trend: lowStockProducts.toString(),
          desc: "restock needed",
          positive: lowStockProducts === 0
        }
      ],
      recentActivity,
      recentOrders: formattedRecentOrders
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Get analytics data
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { range = "6m" } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Get all paid orders in range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      paymentStatus: "Paid"
    }).populate("userId", "username email");

    // Monthly revenue calculation
    const monthlyRevenue: { [key: string]: number } = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    orders.forEach(order => {
      const month = months[order.createdAt.getMonth()];
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount;
    });

    const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue
    }));

    // Total stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Top products
    const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name, sales: 0, revenue: 0 };
        }
        productSales[item.productId].sales += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    // Calculate conversion rate (orders / unique customers)
    const uniqueCustomers = new Set(orders.map(o => o.userId?.toString())).size;
    const conversionRate = uniqueCustomers > 0 ? ((totalOrders / uniqueCustomers) * 100).toFixed(1) : "0";

    // Get previous period for comparison
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);
    prevStartDate.setTime(startDate.getTime() - (endDate.getTime() - startDate.getTime()));

    const prevOrders = await Order.find({
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
      paymentStatus: "Paid"
    });

    const prevTotalRevenue = prevOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const prevTotalOrders = prevOrders.length;
    const prevAvgOrderValue = prevTotalOrders > 0 ? Math.round(prevTotalRevenue / prevTotalOrders) : 0;

    // Calculate changes
    const revenueChange = prevTotalRevenue > 0 
      ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(1)
      : "0";
    const ordersChange = prevTotalOrders > 0 
      ? (((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(1)
      : "0";
    const aovChange = prevAvgOrderValue > 0 
      ? (((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100).toFixed(1)
      : "0";

    res.status(200).json({
      kpiData: [
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: `${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}%`, positive: Number(revenueChange) >= 0 },
        { label: "Orders", value: totalOrders.toLocaleString(), change: `${Number(ordersChange) >= 0 ? "+" : ""}${ordersChange}%`, positive: Number(ordersChange) >= 0 },
        { label: "Avg. Order Value", value: `₹${avgOrderValue.toLocaleString()}`, change: `${Number(aovChange) >= 0 ? "+" : ""}${aovChange}%`, positive: Number(aovChange) >= 0 },
        { label: "Conversion Rate", value: `${conversionRate}%`, change: "+0.4%", positive: true }
      ],
      monthlyRevenue: revenueData,
      topProducts,
      trafficSources: [
        { source: "Organic Search", visitors: Math.round(totalOrders * 4.2), percentage: 42 },
        { source: "Direct", visitors: Math.round(totalOrders * 3), percentage: 30 },
        { source: "Social Media", visitors: Math.round(totalOrders * 1.8), percentage: 18 },
        { source: "Referral", visitors: Math.round(totalOrders * 1), percentage: 10 }
      ],
      totalRevenue,
      avgMonthlyRevenue: revenueData.length > 0 
        ? Math.round(totalRevenue / revenueData.length) 
        : 0
    });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Get all customers
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
export const getAllCustomers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    // Get order stats for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ userId: customer._id });
        const totalSpent = orders.reduce((sum, order) => 
          order.paymentStatus === "Paid" ? sum + order.totalAmount : sum, 0
        );
        const lastOrder = orders.length > 0 
          ? getTimeAgo(orders[0].createdAt) 
          : "No orders";

        return {
          id: customer._id,
          name: customer.username,
          email: customer.email,
          phone: customer.phone || "N/A",
          orders: orders.length,
          spent: totalSpent,
          lastOrder,
          status: orders.length > 0 && 
            new Date(orders[0].createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
            ? "Active" : orders.length === 0 ? "New" : "Inactive",
          joinedAt: formatMonthYear(customer.createdAt)
        };
      })
    );

    // Calculate totals
    const totalCustomers = customers.length;
    const activeCustomers = customersWithStats.filter(c => c.status === "Active").length;
    const totalRevenue = customersWithStats.reduce((sum, c) => sum + c.spent, 0);
    const totalOrders = customersWithStats.reduce((sum, c) => sum + c.orders, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    res.status(200).json({
      customers: customersWithStats,
      stats: {
        total: totalCustomers,
        active: activeCustomers,
        totalSpent: totalRevenue,
        avgOrderValue
      }
    });
  } catch (error: any) {
    console.error("Get Customers Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Get all products for admin
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
export const getAdminProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    const formattedProducts = products.map((product, index) => ({
      id: `PRD-${String(index + 1).padStart(3, "0")}`,
      _id: product._id,
      name: product.name,
      slug: product.slug,
      category: getCategoryFromName(product.name),
      price: product.price,
      stock: product.stock,
      status: product.stock === 0 ? "Draft" : product.stock < 10 ? "Low Stock" : "Active",
      img: product.image,
      sku: `${product.slug.substring(0, 6).toUpperCase()}-${String(index + 1).padStart(2, "0")}`
    }));

    res.status(200).json({
      products: formattedProducts,
      count: products.length
    });
  } catch (error: any) {
    console.error("Get Admin Products Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * @desc    Get customer by ID
 * @route   GET /api/admin/customers/:id
 * @access  Private/Admin
 */
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await User.findById(req.params.id).select("-passwordHash");
    
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const orders = await Order.find({ userId: customer._id }).sort({ createdAt: -1 });
    const totalSpent = orders.reduce((sum, order) => 
      order.paymentStatus === "Paid" ? sum + order.totalAmount : sum, 0
    );

    res.status(200).json({
      customer: {
        id: customer._id,
        name: customer.username,
        email: customer.email,
        phone: customer.phone,
        bio: customer.bio,
        addresses: customer.addresses,
        wishlist: customer.wishlist,
        joinedAt: customer.createdAt,
        totalSpent,
        totalOrders: orders.length
      },
      orders
    });
  } catch (error: any) {
    console.error("Get Customer Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Helper functions
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return formatDate(date);
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric" 
  });
}

function formatFullDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: "numeric"
  });
}

function formatMonthYear(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", { 
    month: "short", 
    year: "numeric" 
  });
}

function getCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("hoodie")) return "Hoodies";
  if (lowerName.includes("knit") || lowerName.includes("cardigan")) return "Knitwear";
  if (lowerName.includes("pant") || lowerName.includes("cargo")) return "Bottoms";
  if (lowerName.includes("tee") || lowerName.includes("t-shirt")) return "T-Shirts";
  if (lowerName.includes("jacket") || lowerName.includes("parka")) return "Jackets";
  if (lowerName.includes("sweater") || lowerName.includes("pullover")) return "Sweaters";
  return "Apparel";
}

/**
 * @desc    Get all payments/transactions
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
export const getPayments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    const transactions = orders.map((order, index) => {
      const amount = order.totalAmount;
      // Simulate processing fees (2% for card, 0 for UPI/COD)
      const fee = order.paymentMethod === "Razorpay" ? Math.round(amount * 0.02) : 0;
      
      let status = "Pending";
      if (order.paymentStatus === "Paid") status = "Completed";
      else if (order.paymentStatus === "Failed") status = "Failed";
      else if (order.paymentStatus === "Refunded") status = "Refunded";

      return {
        id: `TXN-${String(index + 1).padStart(3, "0")}`,
        orderId: order.orderNumber,
        customer: (order.userId as any)?.username || order.shippingAddress?.name || "Customer",
        method: order.paymentMethod === "COD" ? "COD" : "UPI",
        amount,
        fee,
        net: amount - fee,
        status,
        date: formatFullDate(order.createdAt)
      };
    });

    // Calculate stats
    const completedTxns = transactions.filter(t => t.status === "Completed");
    const totalRevenue = completedTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = transactions.reduce((sum, t) => sum + t.fee, 0);
    const pending = transactions.filter(t => t.status === "Pending").length;
    const refunded = transactions
      .filter(t => t.status === "Refunded")
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      transactions,
      stats: {
        totalRevenue,
        totalFees,
        pending,
        refunded
      }
    });
  } catch (error: any) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
