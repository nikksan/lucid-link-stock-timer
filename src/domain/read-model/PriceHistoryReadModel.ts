import { DateRange, PriceHistory } from '../types';

interface PriceHistoryReadModel {
  getRange(): Promise<DateRange | null>;
  getHistory(range: DateRange): Promise<PriceHistory>,
}

export default PriceHistoryReadModel;
