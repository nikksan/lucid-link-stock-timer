import { Response } from 'express';
import { APIError } from './APIErrors';

class API {
  static sendData(response: Response, data: unknown): void {
    response.send({
      data,
      error: null,
    });
  }

  static sendError(response: Response, error: APIError): void {
    response.status(error.status).send({
      data: null,
      error,
    });
  }
}

export default API;
