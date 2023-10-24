import CalculateEntryAndExitQuery from "@application/CalculateEntryAndExitQuery";
import NoDataError from "@application/errors/NoDataError";
import { makeDateRange } from "@application/types";
import { loadConfig } from "@config/index";
import LoggerFactory from "@infrastructure/logger/LoggerFactory";
import arrayToAsyncIterable from "../../util/arrayToAsyncIterable";

describe('CalculateEntryAndExitQuery', () => {
  const mockPriceHistoryReadModel = {
    getRange: jest.fn(),
    getHistory: jest.fn()
  };

  const config = loadConfig();
  const query = new CalculateEntryAndExitQuery(
    mockPriceHistoryReadModel,
    new LoggerFactory(config.log)
  );

  it('should throw NoDataError when getRange returns null', async () => {
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce(null);

    await expect(query.run(makeDateRange([
      '2020-01-01 00:00:00',
      '2020-01-02 00:00:00',
    ]))).rejects.toThrow(NoDataError);
  });

  it.each([
    [['2018-01-01 00:00:00', '2019-01-06 00:00:00']],
    [['2019-01-01 00:00:00', '2021-01-01 00:00:00']],
    [['2019-01-01 00:00:00', '2020-01-01 00:00:01']],
  ])('should throw RangeError when requested range is not within the possible range', async (dateRange) => {
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce([
      '2019-01-01 00:00:00',
      '2020-01-01 00:00:00',
    ]);

    await expect(query.run(makeDateRange(dateRange))).rejects.toThrow(RangeError);
  });

  it('should calculate the best entry and exit', async () => {
    const dateRange = makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:02',
    ]);
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce(dateRange);

    mockPriceHistoryReadModel.getHistory.mockResolvedValueOnce({
      total: 3,
      items: arrayToAsyncIterable([
        { price: 1, date: '2019-01-01 00:00:00' },
        { price: 2, date: '2019-01-01 00:00:01' },
        { price: 3, date: '2019-01-01 00:00:02' },
      ])
    });

    const bestSolution = await query.run(dateRange);

    expect(bestSolution).toEqual(expect.objectContaining({
      entryPrice: 1,
      exitPrice: 3,
    }));
  });

  it('should return null if there is no profitable strategy (price goes down only)', async () => {
    const dateRange = makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:02',
    ]);
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce(dateRange);

    mockPriceHistoryReadModel.getHistory.mockResolvedValueOnce({
      total: 3,
      items: arrayToAsyncIterable([
        { price: 3, date: '2019-01-01 00:00:00' },
        { price: 2, date: '2019-01-01 00:00:01' },
        { price: 1, date: '2019-01-01 00:00:02' },
      ])
    });

    const bestSolution = await query.run(dateRange);

    expect(bestSolution).toEqual(null);
  });

  it('should return null if there is no profitable strategy (price is sideways)', async () => {
    const dateRange = makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:02',
    ]);
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce(dateRange);

    mockPriceHistoryReadModel.getHistory.mockResolvedValueOnce({
      total: 3,
      items: arrayToAsyncIterable([
        { price: 3, date: '2019-01-01 00:00:00' },
        { price: 3, date: '2019-01-01 00:00:01' },
        { price: 3, date: '2019-01-01 00:00:02' },
      ])
    });

    const bestSolution = await query.run(dateRange);

    expect(bestSolution).toEqual(null);
  });

  it('should return the earliest solution if there are two equal', async () => {
    const dateRange = makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:05',
    ]);
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce(dateRange);

    mockPriceHistoryReadModel.getHistory.mockResolvedValueOnce({
      total: 3,
      items: arrayToAsyncIterable([
        { price: 1, date: '2019-01-01 00:00:00' },
        { price: 2, date: '2019-01-01 00:00:01' },
        { price: 3, date: '2019-01-01 00:00:02' },
        { price: 1, date: '2019-01-01 00:00:03' },
        { price: 2, date: '2019-01-01 00:00:04' },
        { price: 3, date: '2019-01-01 00:00:05' },
      ])
    });

    const bestSolution = await query.run(dateRange);

    expect(bestSolution).toEqual(expect.objectContaining({
      entryPrice: 1,
      exitPrice: 3,
      entryDate: '2019-01-01 00:00:00',
      exitDate: '2019-01-01 00:00:02',
    }));
  });

  it('should return the earliest and shortest solution if there are two equal', async () => {
    const dateRange = makeDateRange([
      '2019-01-01 00:00:00',
      '2019-01-01 00:00:04',
    ]);
    mockPriceHistoryReadModel.getRange.mockResolvedValueOnce(dateRange);

    mockPriceHistoryReadModel.getHistory.mockResolvedValueOnce({
      total: 3,
      items: arrayToAsyncIterable([
        { price: 1, date: '2019-01-01 00:00:00' },
        { price: 2, date: '2019-01-01 00:00:01' },
        { price: 3, date: '2019-01-01 00:00:02' },
        { price: 1, date: '2019-01-01 00:00:03' },
        { price: 3, date: '2019-01-01 00:00:04' },
      ])
    });

    const bestSolution = await query.run(dateRange);

    expect(bestSolution).toEqual(expect.objectContaining({
      entryPrice: 1,
      exitPrice: 3,
      entryDate: '2019-01-01 00:00:03',
      exitDate: '2019-01-01 00:00:04',
    }));
  });
});


