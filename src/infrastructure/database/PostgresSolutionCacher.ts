import { DateRange, Solution } from "@application/types";
import { Config } from "@config/Config";
import { Pool } from "pg";
import SolutionCacher from "./SolutionCacher";

export default class PostgresSolutionCacher implements SolutionCacher {
  private pool: Pool;

  constructor(config: Config['db']) {
    this.pool = new Pool(config);
  }

  async getSolution(dateRange: DateRange): Promise<Solution | null | undefined> {
    const { rows: [row] } = await this.pool.query(`
      SELECT "entryDate", "exitDate", "entryPrice", "exitPrice" FROM "SolutionCache"
      WHERE
        "dateRangeStart" <= $1 AND ("entryDate" IS NULL OR $1 <= "entryDate") AND
        ("exitDate" IS NULL OR "exitDate" <= $2) AND $2 <= "dateRangeEnd"
    `, [dateRange[0], dateRange[1]]);

    if (!row) {
      return;
    }

    if (row.entryDate === null) {
      return null;
    }

    return row;
  }

  async storeSolution(dateRange: DateRange, solution: Solution | null): Promise<void> {
    await this.pool.query('INSERT INTO "SolutionCache" ("dateRangeStart", "dateRangeEnd", "entryDate", "exitDate", "entryPrice", "exitPrice") VALUES ($1, $2, $3, $4, $5, $6);', [
      dateRange[0],
      dateRange[1],
      solution?.entryDate || null,
      solution?.exitDate || null,
      solution?.entryPrice || null,
      solution?.exitPrice || null,
    ]);
  }
}
