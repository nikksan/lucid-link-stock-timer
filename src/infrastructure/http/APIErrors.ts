const APIErrors = {
  GENERAL_ERROR: { status: 500, code: 'general_error', message: 'General error, try again later.' },
  INVALID_PARAMS: { status: 400, code: 'invalid_params' },
  NOT_FOUND: { status: 404, code: 'not_found', message: 'Not found' },
  RANGE_ERROR: { status: 400, code: 'range_error' },
} as const;

export type APIError = {
  status: number,
  code: string,
  message: string,
}

export default APIErrors;
