import CalculateEntryAndExitQuery from '@application/CalculateEntryAndExitQuery';
import { makeDateRange } from '@application/types';
import { Request, Response, NextFunction } from 'express';
import API from './API';
import APIErrors from './APIErrors';

export default class HttpController {
  constructor(
    private calculateEntryAndExitQuery: CalculateEntryAndExitQuery,
  ) {}

  calculateEntryAndExit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const range = makeDateRange([req.query.from, req.query.to]);
      const solution = await this.calculateEntryAndExitQuery.run(range);

      API.sendData(res, solution ? {
        entryPrice: solution.entryPrice,
        entryDate: solution.entryDate,
        exitPrice: solution.exitPrice,
        exitDate: solution.exitDate,
      } : null);
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
  }
}
