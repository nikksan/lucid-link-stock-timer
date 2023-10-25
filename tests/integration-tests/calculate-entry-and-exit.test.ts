import HttpServer from '@infrastructure/http/HttpServer';
import container from '../../src/root';
import ApiClient from './util/ApiClient';
import StubbedPriceHistoryReadModel from 'tests/util/StubbedPriceHistoryReadModel';
import { makeDateRange } from '@application/types';
import arrayToAsyncIterable from '../util/arrayToAsyncIterable';

describe('calculate entry and exit', () => {
  const httpServer = container.resolve<HttpServer>('httpServer');
  const app = httpServer.getExpressApp();
  const apiClient = new ApiClient(app);
  const endpoint = '/calculateEntryAndExit';
  const priceHistoryReadModel = container.resolve<StubbedPriceHistoryReadModel>('priceHistoryReadModel');

  afterEach(() => priceHistoryReadModel.clearStubs());

  it('should die with 400[1001] when from and to are missing', async () => {
    const response = await apiClient.get(endpoint);

    expect(response.statusCode).toEqual(400);
    expect(response.body.data).toEqual(null);
    expect(response.body.error).toEqual(expect.objectContaining({
      code: 1001,
      message: 'Expected date to be in format "YYYY-MM-DD HH:mm:ss", received: undefined',
    }));
  });

  it.each([
    undefined,
    '2020.01.01',
  ])('should die with 400[1001] when to is missing or in invalid format', async (value) => {
    const response = await apiClient.get(endpoint, {
      from: value,
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.data).toEqual(null);
    expect(response.body.error).toEqual(expect.objectContaining({
      code: 1001,
      message: `Expected date to be in format "YYYY-MM-DD HH:mm:ss", received: ${value}`,
    }));
  });

  it.each([
    undefined,
    '2023-10-24T13:06:08.316Z',
  ])('should die with 400[1001] when from is missing or in invalid format', async (value) => {
    const response = await apiClient.get(endpoint, {
      from: '2020-01-29 01:07:25',
      to: value,
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.data).toEqual(null);
    expect(response.body.error).toEqual(expect.objectContaining({
      code: 1001,
      message: `Expected date to be in format "YYYY-MM-DD HH:mm:ss", received: ${value}`,
    }));
  });

  it('should die with 400[1001] when from and to do not form a valid range', async () => {
    const response = await apiClient.get(endpoint, {
      from: '2020-01-29 01:07:25',
      to: '2019-01-29 01:07:25',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.data).toEqual(null);
    expect(response.body.error).toEqual(expect.objectContaining({
      code: 1001,
      message: 'Expected valid date range',
    }));
  });

  it('should die with 400[1003] when from and to do not fall in the covered range', async () => {
    priceHistoryReadModel.stubRange(makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 10:00:00',
    ]));

    const response = await apiClient.get(endpoint, {
      from: '2019-01-01 00:00:00',
      to: '2019-01-01 11:00:00',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.data).toEqual(null);
    expect(response.body.error).toEqual(expect.objectContaining({
      code: 1003,
      message: expect.stringContaining('is not within possible range'),
    }));
  });

  it('should succeed with 200 but return null when there is no profitable solution', async () => {
    priceHistoryReadModel.stubRange(makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:05',
    ]));

    priceHistoryReadModel.stubPriceHistory({
      items: arrayToAsyncIterable([
        { price: 1, date: '2019-01-01 00:00:00' },
        { price: 1, date: '2019-01-01 00:00:01' },
        { price: 1, date: '2019-01-01 00:00:02' },
        { price: 1, date: '2019-01-01 00:00:03' },
        { price: 1, date: '2019-01-01 00:00:04' },
        { price: 1, date: '2019-01-01 00:00:05' },
      ]),
      total: 5,
    });

    const response = await apiClient.get(endpoint, {
      from: '2019-01-01 00:00:02',
      to: '2019-01-01 00:00:04',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.data).toEqual(null);
  });

  it('should succeed with 200 and return solution when there is a profitable solution', async () => {
    priceHistoryReadModel.stubRange(makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:05',
    ]));

    priceHistoryReadModel.stubPriceHistory({
      items: arrayToAsyncIterable([
        { price: 3, date: '2019-01-01 00:00:02' },
        { price: 4, date: '2019-01-01 00:00:03' },
        { price: 5, date: '2019-01-01 00:00:04' },
      ]),
      total: 5,
    });

    const response = await apiClient.get(endpoint, {
      from: '2019-01-01 00:00:02',
      to: '2019-01-01 00:00:04',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.data).toEqual({
      entryPrice: 3,
      exitPrice: 5,
      entryDate: '2019-01-01 00:00:02',
      exitDate: '2019-01-01 00:00:04',
    });
  });
});
