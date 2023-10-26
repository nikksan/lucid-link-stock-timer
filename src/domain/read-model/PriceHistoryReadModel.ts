import { DateRange, PriceHistory } from '../../application/types';

interface PriceHistoryReadModel {
  getRange(): Promise<DateRange | null>;
  getHistory(range: DateRange): Promise<PriceHistory>,
}

export default PriceHistoryReadModel;
