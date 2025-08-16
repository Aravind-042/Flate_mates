// Input validation and sanitization utilities for security

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email);
  return emailRegex.test(sanitized) && sanitized.length <= 254;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  const sanitized = sanitizeInput(phone).replace(/[\s-()]/g, '');
  return phoneRegex.test(sanitized) && sanitized.length >= 10 && sanitized.length <= 15;
};

export const validateName = (name: string): boolean => {
  const sanitized = sanitizeInput(name);
  return sanitized.length >= 2 && sanitized.length <= 100 && /^[a-zA-Z\s.-]+$/.test(sanitized);
};

export const validateAmount = (amount: number): boolean => {
  return Number.isInteger(amount) && amount >= 0 && amount <= 10000000; // Max 1 crore
};

export const validateText = (text: string, minLength = 1, maxLength = 2000): boolean => {
  const sanitized = sanitizeInput(text);
  return sanitized.length >= minLength && sanitized.length <= maxLength;
};

export const validateURL = (url: string): boolean => {
  try {
    const sanitized = sanitizeInput(url);
    const parsedUrl = new URL(sanitized);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Rate limiting for form submissions
const submissionTimes = new Map<string, number[]>();

export const checkSubmissionRateLimit = (formType: string, maxSubmissions = 5, windowMinutes = 15): boolean => {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  if (!submissionTimes.has(formType)) {
    submissionTimes.set(formType, []);
  }
  
  const times = submissionTimes.get(formType)!;
  
  // Remove old submissions outside the window
  const recentTimes = times.filter(time => now - time < windowMs);
  
  if (recentTimes.length >= maxSubmissions) {
    return false;
  }
  
  recentTimes.push(now);
  submissionTimes.set(formType, recentTimes);
  
  return true;
};