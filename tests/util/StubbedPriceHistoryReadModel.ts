import PriceHistoryReadModel from "@application/service/PriceHistoryReadModel";
import { DateRange, PriceHistory } from "@application/types";

export default class StubbedPriceHistoryReadModel implements PriceHistoryReadModel {
  private priceHistory: PriceHistory | undefined;
  private range: DateRange | null | undefined;

  async getHistory(_range: DateRange): Promise<PriceHistory> {
    if (!this.priceHistory) {
      throw new Error(`No priceHistory, call stubPriceHistory() first!`);
    }

    return this.priceHistory;
  }

  async getRange(): Promise<DateRange | null> {
    if (this.range === undefined) {
      throw new Error(`No range, call stubRange() first!`);
    }

    return this.range;
  }

  stubPriceHistory(priceHistory: PriceHistory) {
    this.priceHistory = priceHistory;
  }

  stubRange(range: DateRange | null) {
    this.range = range;
  }

  clearStubs() {
    this.priceHistory = undefined;
    this.range = undefined;
  }
}
