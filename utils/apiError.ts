export function apiErrorFromResponse(response: any) {
  let message = response?.message || 'Request failed'

  if (response?.errors && Array.isArray(response.errors) && response.errors.length) {
    message = response.errors.join('\n')
  } else if (response?.errors && typeof response.errors === 'object') {
    const errorMessages = Object.values(response.errors).flat().join('\n')
    if (errorMessages) message = errorMessages
  }

  const error = new Error(message) as Error & { validationErrors?: any; response?: any }
  error.validationErrors = response?.errors
  error.response = response
  return error
}

export function apiErrorFromFetchError(error: any, fallbackResponse?: any) {
  const response = error?.data || error?.response?._data || fallbackResponse

  if (response) {
    return apiErrorFromResponse(response)
  }

  return error
}
