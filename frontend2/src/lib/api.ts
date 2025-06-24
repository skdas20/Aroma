// API configuration for the admin frontend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aroma-1ikm.onrender.com';

// Helper function to build API URLs
export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
