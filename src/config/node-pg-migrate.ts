// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadConfig } = require('./index');

const { db } = loadConfig();
module.exports = db;
