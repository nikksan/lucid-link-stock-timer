import LoggerFactory from '@infrastructure/logger/LoggerFactory';
import NoDataError from './errors/NoDataError';
import EntryAndExitCalculator from './service/EntryAndExitCalculator';
import PriceHistoryReadModel from './service/PriceHistoryReadModel';
import { DateRange, Solution, isDateRangeWithinAnotherOne } from './types';

export default class CalculateEntryAndExitQuery {
  private entryAndExitCalculator: EntryAndExitCalculator;

  constructor(
    private priceHistoryReadModel: PriceHistoryReadModel,
    loggerFactory: LoggerFactory,
  ) {
    this.entryAndExitCalculator = new EntryAndExitCalculator(loggerFactory);
  }

  async run(dateRange: DateRange): Promise<Solution | null> {
    const possibleDateRange = await this.priceHistoryReadModel.getRange();
    if (!possibleDateRange) {
      throw new NoDataError();
    }

    if (!isDateRangeWithinAnotherOne(dateRange, possibleDateRange)) {
      throw new RangeError(`Requested range is not within possible range ${possibleDateRange}`);
    }

    const priceHistory = await this.priceHistoryReadModel.getHistory(dateRange);
    return this.entryAndExitCalculator.calculate(priceHistory);
  }
}
