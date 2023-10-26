import PriceHistoryReadModel from '@domain/read-model/PriceHistoryReadModel';
import { DateRange, PriceHistory } from '@application/types';

export default class StubbedPriceHistoryReadModel implements PriceHistoryReadModel {
  private priceHistory: PriceHistory | undefined;
  private range: DateRange | null | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getHistory(_range: DateRange): Promise<PriceHistory> {
    if (!this.priceHistory) {
      throw new Error('No priceHistory, call stubPriceHistory() first!');
    }

    return this.priceHistory;
  }

  async getRange(): Promise<DateRange | null> {
    if (this.range === undefined) {
      throw new Error('No range, call stubRange() first!');
    }

    return this.range;
  }

  stubPriceHistory(priceHistory: PriceHistory): void {
    this.priceHistory = priceHistory;
  }

  stubRange(range: DateRange | null): void {
    this.range = range;
  }

  clearStubs(): void {
    this.priceHistory = undefined;
    this.range = undefined;
  }
}
