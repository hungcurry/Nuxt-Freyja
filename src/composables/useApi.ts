import type { TApiFailureResponse, TApiResponse, TApiSuccessResponse } from '@/types/apiTypes'

export function useApi() {
  function isApiSuccess<T>(response: TApiResponse<T>): response is TApiSuccessResponse<T> {
    return response.status === true || response.status === 'success' || response.status === 'ok'
  }

  function isApiFailure<T>(response: TApiResponse<T>): response is TApiFailureResponse {
    return response.status === false || response.status === 'error' || response.status === 'fail'
  }

  return {
    isApiSuccess,
    isApiFailure,
  }
}
