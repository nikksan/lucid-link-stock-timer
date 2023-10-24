import PriceHistoryReadModel from "@application/service/PriceHistoryReadModel";
import { Config } from "@config/Config";
import { Pool, types } from 'pg'
import QueryStream from 'pg-query-stream';
import { Transform, TransformCallback, pipeline } from "stream";
import { DateRange, PriceHistory, PricePoint } from "@application/types";

// disable parsing of timestamp
types.setTypeParser(types.builtins.TIMESTAMP, (timeStr) => timeStr);

export default class PostgresPriceHistoryReadModel implements PriceHistoryReadModel {
  private pool: Pool;

  constructor(config: Config['db']) {
    this.pool = new Pool(config);
  }

  async getRange(): Promise<DateRange | null> {
    const { rows: [row] } = await this.pool.query('SELECT MIN(date), MAX(date) FROM "PriceHistory";');
    if (!row || row.min === row.max) {
      return null;
    }

    return [row.min, row.max] as DateRange;
  }

  async getHistory(range: DateRange): Promise<PriceHistory> {
    const { rows: [row] } =  await this.pool.query('SELECT COUNT(*) FROM "PriceHistory" WHERE date BETWEEN $1 AND $2;', range);
    const query = new QueryStream(`SELECT price, date FROM "PriceHistory" WHERE date BETWEEN $1 AND $2 ORDER BY date ASC;`, range);
    const client = await this.pool.connect();
    const resultStream = client.query(query);

    const transformStream = new Transform({
      objectMode: true,
      transform: (dao: PricePoint, _: BufferEncoding, callback: TransformCallback) => callback(null, dao),
    });

    return {
      items: pipeline(resultStream, transformStream, () => client.release()),
      total: row.count,
    };
  }
}
