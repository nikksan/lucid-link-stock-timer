import LoggerFactory from '@infrastructure/logger/LoggerFactory';
import NoDataError from './errors/NoDataError';
import EntryAndExitCalculator from '@domain/service/EntryAndExitCalculator';
import PriceHistoryReadModel from '@domain/read-model/PriceHistoryReadModel';
import { DateRange, Solution, isDateRangeWithinAnotherOne } from '../domain/types';
import { format } from 'util';

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
      throw new RangeError(`Requested range is not within possible range ${format(possibleDateRange)}`);
    }

    const priceHistory = await this.priceHistoryReadModel.getHistory(dateRange);
    return this.entryAndExitCalculator.calculate(priceHistory);
  }
}
