import { LogImplementation } from '@infrastructure/logger/LoggerFactory';
import { Config } from './Config';
import { LogLevel } from '@infrastructure/logger/Logger';
import { parseEnum, parseNumber, parseString } from './env-parsers';
import { config as loadDotEnvConfig } from 'dotenv';

loadDotEnvConfig();

const config: Config = {
  log: {
    impl: parseEnum<LogImplementation>('LOG_IMPL', Object.values(LogImplementation), LogImplementation.Console),
    level: parseEnum<LogLevel>('LOG_LEVEL', Object.values(LogLevel), LogLevel.Debug),
  },
  server: {
    port: parseNumber('SERVER_PORT', 4000),
    enableCORS: false,
  },
  db: {
    database: parseString('DB_NAME', 'test_db'),
    user: parseString('DB_USER'),
    password: parseString('DB_PASSWORD'),
    host: parseString('DB_HOST', 'localhost'),
    port: parseNumber('DB_PORT', 5432),
  },
};

export default config;
