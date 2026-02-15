/**
 * Enhanced error handling for PocketBase errors
 * Extracts detailed validation errors and specific error messages
 */

export function getPocketBaseErrorMessage(error: unknown): string {
  // Check if it's a PocketBase ClientResponseError
  if (error && typeof error === 'object') {
    const err = error as any
    
    // Debug: Check the full error structure
    if (process.env.NODE_ENV === 'development' && err.response) {
      console.log('Full error response:', err.response)
    }
    
    // Check for validation errors in response.data
    if (err.response && err.response.data) {
      const data = err.response.data
      
      // If there are field-level validation errors (PocketBase format)
      if (typeof data === 'object' && !Array.isArray(data)) {
        const fieldErrors: string[] = []
        
        for (const [field, value] of Object.entries(data)) {
          // PocketBase format: { fieldName: { code: '...', message: '...' } }
          if (typeof value === 'object' && value !== null) {
            const fieldError = value as any
            if (fieldError.message) {
              fieldErrors.push(`${field}: ${fieldError.message}`)
            } else if (fieldError.code) {
              fieldErrors.push(`${field}: ${fieldError.code}`)
            } else if (typeof fieldError === 'string') {
              fieldErrors.push(`${field}: ${fieldError}`)
            }
          } else if (typeof value === 'string') {
            fieldErrors.push(`${field}: ${value}`)
          }
        }
        
        if (fieldErrors.length > 0) {
          return fieldErrors.join(', ')
        }
      }
      
      // Check for a general error message in response
      if (typeof data === 'string') {
        return data
      }
      
      if (data.message && typeof data.message === 'string') {
        return data.message
      }
    }
    
    // Check for direct message in error
    if (err.originalResponse && err.originalResponse.message) {
      return err.originalResponse.message
    }
    
    // Check for status-based error messages
    if (err.status) {
      if (err.status === 400) {
        const detail = err.message && !err.message.includes('400') 
          ? err.message 
          : 'The data provided is invalid or validation failed'
        return `Invalid request (400): ${detail}`
      }
      if (err.status === 401) {
        return 'Unauthorized: You are not authenticated. Please log in.'
      }
      if (err.status === 403) {
        return 'Forbidden: You do not have permission to perform this action.'
      }
      if (err.status === 404) {
        return 'Not found: The requested resource does not exist.'
      }
      if (err.status === 500) {
        return 'Server error: The server encountered an error. Please try again later.'
      }
    }
    
    // Fall back to the error message
    if (err.message && typeof err.message === 'string') {
      // Remove status code from message if present
      let msg = err.message.replace(/^.*?\d{3}:\s*/, '')
      return msg || 'An error occurred while processing your request'
    }
  }
  
  // Fallback for standard Error objects
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unknown error occurred while processing your request'
}

export function logDetailedError(
  context: string,
  error: unknown
): void {
  console.error(`[${context}]`, error)
  
  if (error && typeof error === 'object') {
    const err = error as any
    if (err.status) {
      console.error(`Status: ${err.status}`)
    }
    if (err.response) {
      console.error('Response:', err.response)
    }
  }
}
