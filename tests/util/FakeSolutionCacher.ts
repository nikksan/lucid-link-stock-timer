import { DateRange, Solution } from '@domain/types';
import SolutionCacher from '@infrastructure/database/SolutionCacher';

export default class FakeSolutionCacher implements SolutionCacher {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSolution(_dateRange: DateRange): Promise<Solution | null | undefined> {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async storeSolution(_dateRange: DateRange, _solution: Solution | null): Promise<void> {

  }
}
