import NoDataError from "./errors/NoDataError";
import EntryAndExitCalculator from "./service/EntryAndExitCalculator";
import PriceHistoryReadModel from "./service/PriceHistoryReadModel";
import { DateRange, Solution, isDateRangeWithinAnotherOne } from "./types";

export default class CalculateEntryAndExitQuery {
  private entryAndExitCalculator = new EntryAndExitCalculator();

  constructor(
    private priceHistoryReadModel: PriceHistoryReadModel,
  ) {}

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
