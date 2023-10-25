import { LogLevel } from '@infrastructure/logger/Logger';
import { LogImplementation } from '@infrastructure/logger/LoggerFactory';

export interface Config {
  log: {
    impl: LogImplementation;
    level: LogLevel;
  };
  server: {
    port: number;
    enableCORS: boolean,
  };
  db: {
    user: string,
    password: string,
    host: string,
    port: number,
    database: string,
  },
}

