import moment from 'moment';

declare const __nominal__type: unique symbol;

export type Nominal<Type, Identifier> = Type & {
  readonly [__nominal__type]: Identifier;
};

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export type DateRange = Nominal<[string, string], 'DateRange'>;
export function makeDateRange(input: unknown): DateRange {
  if (!Array.isArray(input) || input.length !== 2) {
    throw new TypeError(`Expected array of size = 2`);
  }

  for (const item of input) {
    if (!moment(item, DATE_FORMAT, true).isValid()) {
      throw new TypeError(`Expected date to be in format "${DATE_FORMAT}", received: ${item}`);
    }
  }

  if (moment(input[0]).unix() >= moment(input[1]).unix()) {
    throw new TypeError('Expected valid date range');
  }

  return input as DateRange;
}

export function isDateRangeWithinAnotherOne(dateRange: DateRange, anotherDateRange: DateRange) {
  return (
    moment(dateRange[0]).unix() >= moment(anotherDateRange[0]).unix() &&
    moment(dateRange[0]).unix() <= moment(anotherDateRange[1]).unix() &&
    moment(dateRange[1]).unix() >= moment(anotherDateRange[0]).unix() &&
    moment(dateRange[1]).unix() <= moment(anotherDateRange[1]).unix()
  );
}

export type PricePoint = { price: number, date: string };

export type PriceHistory = {
  total: number,
  items: AsyncIterable<PricePoint>,
}

export type Solution = {
  entryPrice: number,
  entryDate: string,
  exitPrice: number,
  exitDate: string,
  length: number,
  profit: number,
};
