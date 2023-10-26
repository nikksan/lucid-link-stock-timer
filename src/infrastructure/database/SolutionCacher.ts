import { DateRange, Solution } from '@domain/types';

interface SolutionCacher {
  getSolution(dateRange: DateRange): Promise<Solution | null | undefined>;
  storeSolution(dateRange: DateRange, solution: Solution | null): Promise<void>;
}

export default SolutionCacher;
