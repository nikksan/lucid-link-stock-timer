import { loadConfig } from '@config/index';
import parseCliArgs from 'minimist';
import pgFormat from 'pg-format';
import { Client } from 'pg';
import moment from 'moment';

(async () => {
  const [from, records] = parseCliArgs(process.argv.slice(2))._;

  if (!from) {
    throw new TypeError('Expected <from> to be provided');
  }

  if (new Date(from).toString() === 'Invalid Date') {
    throw new TypeError('Expected <from> to be valid date');
  }

  if (!records) {
    throw new TypeError('Expected <records> to be provided');
  }

  const batchSize = 1000;
  const recordsAsInt = parseInt(records);
  if (!recordsAsInt || recordsAsInt <= 0 || recordsAsInt % batchSize) {
    throw new TypeError(`Expected <records> to be positive and divisible by ${batchSize}`);
  }

  const config = loadConfig();
  const client = new Client(config.db);
  await client.connect();

  let values: Array<[Date, number]> = [];
  let lastDate: Date | null = null;
  let firstDate: Date | null = null;
  for (let i = 0; i < recordsAsInt; i++) {
    const dateToInsert = moment.utc(from).add(i, 'seconds').set('milliseconds', 0).toDate();
    if (firstDate === null) {
      firstDate = dateToInsert;
    }

    lastDate = dateToInsert;
    values.push([dateToInsert, geRandomPriceBetween(10, 1000)]);

    if (i % batchSize === 0) {
      const sql = pgFormat('INSERT INTO "PriceHistory" (date, price) VALUES %L', values);
      await client.query(sql);

      values = [];
      console.log(`Inserted ${i} records`);
    }
  }

  await client.end();
  if (!firstDate || !lastDate) {
    return;
  }

  console.log(`Done with insertion. Available range: [${firstDate.toISOString()}, ${lastDate.toISOString()}]`);
})();

function geRandomPriceBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
