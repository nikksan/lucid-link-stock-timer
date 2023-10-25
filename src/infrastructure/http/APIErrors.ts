const APIErrors = {
  GENERAL_ERROR: { status: 500, code: 1000, message: 'General error, try again later.' },
  INVALID_PARAMS: { status: 400, code: 1001 },
  NOT_FOUND: { status: 404, code: 1002, message: 'Not found' },
  RANGE_ERROR: { status: 400, code: 1003 },
} as const;

export type APIError = {
  status: number,
  code: number,
  message: string,
}

export default APIErrors;
