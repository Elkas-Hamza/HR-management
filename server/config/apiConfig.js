// External API Configuration
// Replace these URLs with your actual external API endpoints

const API_CONFIG = {
  // Base URLs for external APIs (disabled - using local data only)
  EMPLOYEES_API: 'https://jsonplaceholder.typicode.com/users', // Example API
  DEPARTMENTS_API: 'https://your-external-api.com/api/departments',
  SALARIES_API: 'https://your-external-api.com/api/salaries',
  ATTENDANCE_API: 'https://your-external-api.com/api/attendance',
  LEAVES_API: 'https://your-external-api.com/api/leaves',
  
  // Use only local data (skip external API calls)
  USE_LOCAL_DATA_ONLY: true,
  USE_LOCAL_FALLBACK: true,
  
  // Request configuration
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  
  // Headers for authentication if needed
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add authentication headers here if needed
    // 'Authorization': 'Bearer YOUR_API_TOKEN',
    // 'X-API-Key': 'YOUR_API_KEY'
  }
};

module.exports = API_CONFIG;