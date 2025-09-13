import { VALIDATION } from './constants';

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * Validates password strength
 * Requires at least 8 characters, 1 number, and 1 special character
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) return false;
  
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasNumber && hasSpecialChar;
};

/**
 * Validates phone number format
 */
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s+/g, '');
  return VALIDATION.PHONE_REGEX.test(cleaned);
};

/**
 * Validates Aadhaar number format (12 digits)
 */
export const validateAadhaar = (aadhaar: string): boolean => {
  return VALIDATION.AADHAAR_REGEX.test(aadhaar);
};

/**
 * Formats price in Indian currency format
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Formats phone number with country code
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

/**
 * Validates required fields in a form
 */
export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

/**
 * Validates date is not in the future
 */
export const validateDateNotFuture = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  return date <= today;
};

/**
 * Validates minimum age (18 years)
 */
export const validateMinimumAge = (dateOfBirth: string, minimumAge: number = 18): boolean => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minimumAge;
  }
  
  return age >= minimumAge;
};