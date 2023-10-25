import { loadConfig } from '@config/index';
import parseCliArgs from 'minimist';
import pgFormat from 'pg-format';
import { Client } from 'pg';
import moment from 'moment';

(async () => {
  const argv = parseCliArgs(process.argv.slice(2));
  if (!argv.from) {
    throw new TypeError('Expected --from to be provided');
  }

  const startDate = new Date(argv.from);
  if (startDate.toString() === 'Invalid Date') {
    throw new TypeError('Expected --from to be valid date');
  }

  if (!argv.records) {
    throw new TypeError('Expected --records to be provided');
  }

  const batchSize = 1000;
  const recordsAsInt = parseInt(argv.records);
  if (!recordsAsInt || recordsAsInt <= 0 || recordsAsInt % batchSize) {
    throw new TypeError(`Expected --records to be positive and divisible by ${batchSize}`);
  }

  const config = loadConfig();
  const client = new Client(config.db);
  await client.connect();

  let values: Array<[Date, number]> = [];

  for (let i = 0; i < recordsAsInt; i++) {
    const dateToInsert = moment.utc(argv.from).add(i, 'seconds').set('milliseconds', 0).toDate();
    values.push([dateToInsert, geRandomPriceBetween(10, 1000)]);

    if (i % batchSize === 0) {
      const sql = pgFormat('INSERT INTO "PriceHistory" (date, price) VALUES %L', values);
      await client.query(sql);

      values = [];
      console.log(`Inserted ${i} records`);
    }
  }

  await client.end();
  console.log('Done with insertion.');
})();

function geRandomPriceBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
