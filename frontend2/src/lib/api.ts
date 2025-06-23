// API configuration for the admin frontend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to build API URLs
export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
