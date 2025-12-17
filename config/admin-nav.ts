import { 
  HiOutlineHome, HiOutlineCube, HiOutlineShoppingCart, 
  HiOutlineUsers, HiOutlineCurrencyDollar, HiOutlineTag, 
  HiOutlineStar, HiOutlineDocumentText, HiOutlineChartBar, 
  HiOutlineCog6Tooth 
} from "react-icons/hi2";

export const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: HiOutlineHome },
  { name: "Products", href: "/admin/products", icon: HiOutlineCube },
  { name: "Orders", href: "/admin/orders", icon: HiOutlineShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: HiOutlineUsers },
  { name: "Payments", href: "/admin/payments", icon: HiOutlineCurrencyDollar },
  { name: "Coupons", href: "/admin/marketing", icon: HiOutlineTag },
  { name: "Reviews", href: "/admin/reviews", icon: HiOutlineStar },
  { name: "Analytics", href: "/admin/analytics", icon: HiOutlineChartBar },
  
];