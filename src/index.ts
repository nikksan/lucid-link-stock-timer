import HttpServer from '@infrastructure/http/HttpServer';
import container from './root';
import { cpus } from 'node:os';
import cluster from 'node:cluster';
import LoggerFactory from '@infrastructure/logger/LoggerFactory';

(async () => {
  if (cluster.isPrimary) {
    const loggerFactory = container.resolve<LoggerFactory>('loggerFactory');
    const logger = loggerFactory.create('index');
    const numCPUs = cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork();

      worker.on('online', () => {
        logger.info(`Worker ${worker.process.pid} is online`);
      });
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.warn(`Worker ${worker.process.pid} exited with code ${code} [${signal}]`);
      cluster.fork();
    });
    return;
  }

  const httpServer = container.resolve<HttpServer>('httpServer');
  await httpServer.start();
})();

