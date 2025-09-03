export const APP_NAME = 'Agro Mart';
export const APP_DESCRIPTION = 'Fresh Farm Connect - Connecting farmers and buyers directly';

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  FARMER_DASHBOARD: '/farmer-dashboard',
  BUYER_DASHBOARD: '/buyer-dashboard',
  PRODUCT_DETAIL: '/product',
  MARKET_PRICES: '/market-prices'
} as const;

export const USER_TYPES = {
  BUYER: 'buyer',
  FARMER: 'farmer',
  DELIVERY: 'delivery'
} as const;

export const PRODUCT_CATEGORIES = {
  LEAFY_GREENS: 'Leafy Greens',
  ROOT_VEGETABLES: 'Root Vegetables',
  OTHER_VEGETABLES: 'Other Vegetables',
  FRUITS: 'Fruits',
  BERRIES: 'Berries'
} as const;

export const AUTH_METHODS = {
  EMAIL: 'email',
  AADHAAR: 'aadhaar'
} as const;