/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.createTable('PriceHistory', {
    date: { type: 'timestamp', notNull: true, primaryKey: true },
    price: { type: 'double precision', notNull: true },
  });
};

exports.down = async pgm => {
  await pgm.dropTable('PriceHistory');
};
