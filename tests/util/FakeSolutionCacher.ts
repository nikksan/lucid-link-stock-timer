import { DateRange, Solution } from "@application/types";
import SolutionCacher from "@infrastructure/database/SolutionCacher";

export default class FakeSolutionCacher implements SolutionCacher {
  async getSolution(_dateRange: DateRange): Promise<Solution | null | undefined> {
    return undefined;
  }

  async storeSolution(_dateRange: DateRange, _solution: Solution | null): Promise<void> {

  }
}
