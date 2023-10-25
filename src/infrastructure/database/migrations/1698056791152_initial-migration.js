/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.createTable('PriceHistory', {
    date: { type: 'timestamp', notNull: true, primaryKey: true },
    price: { type: 'double precision', notNull: true },
  });

  await pgm.createTable('SolutionCache', {
    dateRangeStart: { type: 'timestamp', notNull: true },
    dateRangeEnd: { type: 'timestamp', notNull: true },
    entryDate: { type: 'timestamp', notNull: false },
    exitDate: { type: 'timestamp', notNull: false },
    entryPrice: { type: 'double precision', notNull: false },
    exitPrice: { type: 'double precision', notNull: false },
  });
};

exports.down = async pgm => {
  await pgm.dropTable('SolutionCache');
  await pgm.dropTable('PriceHistory');
};
