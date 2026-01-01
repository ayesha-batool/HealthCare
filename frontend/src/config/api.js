// API Configuration
// For Vercel: API routes are on the same domain (/api/*)
// In development, it uses the proxy configured in vite.config.js
const getApiUrl = () => {
  // Always use relative URLs - Vercel serves both frontend and API on same domain
  // In development, Vite proxy handles /api requests
  // In production, Vercel rewrites /api/* to serverless functions
  return ''
}

export const API_URL = getApiUrl()

// Helper function to create full API endpoint URLs
export const apiEndpoint = (path) => {
  const baseUrl = API_URL
  // Remove leading slash from path if baseUrl ends with slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

