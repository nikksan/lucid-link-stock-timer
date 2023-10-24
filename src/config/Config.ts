import { LogLevel } from '@infrastructure/logger/Logger';
import { LogImplementation } from '@infrastructure/logger/LoggerFactory';

export interface Config {
  log: {
    impl: LogImplementation;
    level: LogLevel;
  };
  server: {
    port: number;
  };
  db: {
    user: string,
    password: string,
    host: string,
    port: number,
    database: string,
  },
}

