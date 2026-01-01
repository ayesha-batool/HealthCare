// API Configuration
// Supports both same-domain and separate deployments
const getApiUrl = () => {
  // Production: Use environment variable if set (for separate deployments)
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Development: Use localhost or proxy
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  // Production without VITE_API_URL: Use relative URLs (same domain)
  return '';
}

export const API_URL = getApiUrl()

// Helper function to create full API endpoint URLs
export const apiEndpoint = (path) => {
  const baseUrl = API_URL
  // Remove leading slash from path if baseUrl ends with slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

