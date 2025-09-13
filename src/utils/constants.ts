// Application constants and configuration
export const APP_CONFIG = {
  name: 'Agro Mart',
  description: 'Connecting farmers directly with buyers',
  version: '1.0.0'
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  FARMER_DASHBOARD: '/farmer-dashboard',
  BUYER_DASHBOARD: '/buyer-dashboard',
  PRODUCT_DETAIL: '/product',
  MARKET_PRICES: '/market-prices'
} as const;

// User types
export const USER_TYPES = {
  BUYER: 'buyer',
  FARMER: 'farmer',
  DELIVERY: 'delivery'
} as const;

// Product categories
export const PRODUCT_CATEGORIES = {
  LEAFY_GREENS: 'Leafy Greens',
  ROOT_VEGETABLES: 'Root Vegetables', 
  OTHER_VEGETABLES: 'Other Vegetables',
  FRUITS: 'Fruits',
  BERRIES: 'Berries'
} as const;

// Authentication methods
export const AUTH_METHODS = {
  EMAIL: 'email',
  AADHAAR: 'aadhaar'
} as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

// Delivery options
export const DELIVERY_OPTIONS = {
  PICKUP: 'pickup',
  HOME_DELIVERY: 'home_delivery',
  COURIER: 'courier'
} as const;

// Form validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^[+]?[0-9]{10,15}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  AADHAAR_REGEX: /^\d{12}$/
} as const;