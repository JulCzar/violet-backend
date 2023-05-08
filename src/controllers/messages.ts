export const successResponse = (
  message: string,
  data?: Record<string, unknown>
) => ({
  status: 'success',
  message,
  data,
});

export const errorResponse = (
  message: string,
  code: string,
  data?: Record<string, unknown>
) => ({
  status: 'error',
  code,
  message,
  data,
});

export const unknownError = errorResponse('Unknown error', 'E0000');
