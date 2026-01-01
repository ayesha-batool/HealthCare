// API Configuration
// In production, this will use the Railway backend URL
// In development, it uses the proxy configured in vite.config.js
const getApiUrl = () => {
  // Check if we're in production and have a backend URL
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // In development, use relative URLs (handled by Vite proxy)
  // In production without VITE_API_URL, use relative URLs (same domain)
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

