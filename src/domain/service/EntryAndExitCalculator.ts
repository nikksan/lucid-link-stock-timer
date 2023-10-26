import { PriceHistory, Solution } from '@domain/types';
import { Logger } from '@infrastructure/logger/Logger';
import LoggerFactory from '@infrastructure/logger/LoggerFactory';

export default class EntryAndExitCalculator {
  private logger: Logger;
  constructor(
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(this.constructor.name);
  }

  async calculate(priceHistory: PriceHistory): Promise<Solution | null> {
    let min: number | undefined;
    let minIdx: number | undefined;
    let max: number | undefined;
    let maxIdx: number | undefined;
    let entryDate: string | undefined;
    let exitDate: string | undefined;
    let bestSolutionSoFar: Solution | null = null;

    const startTime = Date.now();

    let i = 0;
    for await (const point of priceHistory.items) {
      if (this.shouldPrintProgress(i, priceHistory.total)) {
        this.printProgress(i, priceHistory.total);
      }

      const price = point.price;

      if (min === undefined || price <= min) {
        min = price;
        minIdx = i;
        entryDate = point.date;
        max = undefined;
      }

      if (max === undefined || price > max) {
        max = price;
        maxIdx = i;
        exitDate = point.date;
      }

      if (min === max) {
        i++;
        continue;
      }

      const newSolution = {
        entryPrice: min,
        exitPrice: max,
        profit: max - min,
        length: (maxIdx as number) - (minIdx as number),
        entryDate: (entryDate as string),
        exitDate: (exitDate as string),
      };

      if (
        !bestSolutionSoFar ||
        this.isBetterSolution(bestSolutionSoFar, newSolution)
      ) {
        bestSolutionSoFar = newSolution;
      }

      i++;
    }

    this.logger.debug(`Produced solution for ${priceHistory.total} items in ${Date.now() - startTime} ms`);

    return bestSolutionSoFar;
  }

  private shouldPrintProgress(currentIdx: number, totalItems: number) {
    return (totalItems > 1000000 && (
      currentIdx === 0 ||
      currentIdx % 500000 === 0 ||
      currentIdx === (totalItems - 1)
    ));
  }

  private printProgress(currentIdx: number, totalItems: number) {
    const percentage = Math.round(((currentIdx + 1) / totalItems) * 100);
    this.logger.debug(`Iteration of ${totalItems} items progress: ${percentage}%`);
  }

  private isBetterSolution(
    bestSolutionSoFar: Solution,
    newSolution: Solution,
  ) {
    if (newSolution.profit !== bestSolutionSoFar.profit) {
      return newSolution.profit > bestSolutionSoFar.profit;
    }

    if (newSolution.length !== bestSolutionSoFar.length) {
      return newSolution.length < bestSolutionSoFar.length;
    }

    return false;
  }
}
