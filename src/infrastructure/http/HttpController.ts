import CalculateEntryAndExitQuery from '@application/CalculateEntryAndExitQuery';
import { Solution, makeDateRange } from '@domain/types';
import { Request, Response, NextFunction } from 'express';
import API from './API';
import APIErrors from './APIErrors';
import SolutionCacher from '@infrastructure/database/SolutionCacher';
import LoggerFactory from '@infrastructure/logger/LoggerFactory';
import { Logger } from '@infrastructure/logger/Logger';

export default class HttpController {
  private logger: Logger;

  constructor(
    private calculateEntryAndExitQuery: CalculateEntryAndExitQuery,
    private solutionCacher: SolutionCacher,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create(this.constructor.name);
  }

  calculateEntryAndExit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = makeDateRange([req.query.from, req.query.to]);
      const cachedSolution = await this.solutionCacher.getSolution(range);
      if (cachedSolution) {
        this.logger.debug(`Using cached solution for range ${range}`);
        this.sendSolution(res, cachedSolution);
        return;
      }

      const solution = await this.calculateEntryAndExitQuery.run(range);
      this.logger.debug(`Caching solution for range ${range}`);
      await this.solutionCacher.storeSolution(range, solution);

      this.sendSolution(res, solution);
    } catch (err) {
      if (err instanceof TypeError) {
        return API.sendError(res, {
          ...APIErrors.INVALID_PARAMS,
          message: err.message,
        });
      }

      if (err instanceof RangeError) {
        return API.sendError(res, {
          ...APIErrors.RANGE_ERROR,
          message: err.message,
        });
      }

      next(err);
    }
  };

  private sendSolution(res: Response, solution: Solution | null) {
    API.sendData(res, solution ? {
      entryPrice: solution.entryPrice,
      entryDate: solution.entryDate,
      exitPrice: solution.exitPrice,
      exitDate: solution.exitDate,
    } : null);
  }
}
