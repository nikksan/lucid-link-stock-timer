import request, { Response as SuperTestResponse } from 'supertest';
import { Application } from 'express';

type PlainObject = Record<string, unknown>;

export enum Headers {}

export type Response = SuperTestResponse;

export default class ApiClient {
  constructor(private app: Application) {}

  async get(endpoint: string, params: PlainObject = {}, headers: PlainObject = {}): Promise<Response> {
    return request(this.app)
      .get(endpoint)
      .query(params)
      .set(headers);
  }
}
