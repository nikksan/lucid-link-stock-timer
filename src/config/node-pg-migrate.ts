const { loadConfig } = require('./index');

const { db } = loadConfig();
module.exports = db;
