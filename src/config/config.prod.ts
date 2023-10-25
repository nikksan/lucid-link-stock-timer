import { LogImplementation } from '@infrastructure/logger/LoggerFactory';
import { Config } from './Config';
import { LogLevel } from '@infrastructure/logger/Logger';
import { parseBoolean, parseEnum, parseNumber, parseString } from './env-parsers';

const config: Config = {
  log: {
    impl: parseEnum<LogImplementation>('LOG_IMPL', Object.values(LogImplementation), LogImplementation.Console),
    level: parseEnum<LogLevel>('LOG_LEVEL', Object.values(LogLevel), LogLevel.Info),
  },
  server: {
    port: parseNumber('SERVER_PORT', 80),
    enableCORS: parseBoolean('SERVER_ENABLE_CORS', false),
  },
  db: {
    database: parseString('DB_NAME'),
    user: parseString('DB_USER'),
    password: parseString('DB_PASSWORD'),
    host: parseString('DB_HOST', 'localhost'),
    port: parseNumber('DB_PORT', 5432),
  },
};

export default config;
