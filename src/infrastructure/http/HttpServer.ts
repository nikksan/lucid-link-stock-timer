import express, { NextFunction, Request, Response, Router, Application } from 'express';
import { Server } from 'http';
import { Logger } from '@infrastructure/logger/Logger';
import { Config } from '@config/Config';
import LoggerFactory from '@infrastructure/logger/LoggerFactory';
import API from './API';
import APIErrors from './APIErrors';
import HttpRouterFactory from './HttpRouterFactory';
import path from 'path';
import cors from 'cors';

export default class HttpServer {
  private logger: Logger;
  private app = express();
  private router: Router;

  constructor(
    private config: Config['server'],
    private appRoot: string,
    httpRouterFactory: HttpRouterFactory,
    loggerFactory: LoggerFactory,
  ) {
    this.router = httpRouterFactory.create();
    this.logger = loggerFactory.create(this.constructor.name);

    this.bootstrapRoutes();
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server: Server = this.app.listen(this.config.port);
      server.on('error', reject);
      server.on('listening', () => {
        const address = server.address();
        const bindAddress = typeof address === 'string' ? 'pipe ' + address : 'port ' + address?.port;

        this.logger.info(`Listening on ${bindAddress}`);

        resolve();
      });
    });
  }

  getExpressApp(): Application {
    return this.app;
  }

  private bootstrapRoutes() {
    if (this.config.enableCORS) {
      this.app.use(cors());
    }

    this.app.use('/docs', express.static(path.join(this.appRoot, 'docs')));
    this.app.use('/docs/swagger-ui', express.static(path.join(this.appRoot, 'node_modules', 'swagger-ui-dist')));

    this.app.use(this.router);
    this.app.use(this.send404);
    this.app.use(this.handleError);
  }

  private send404 = (_request: Request, response: Response) => {
    API.sendError(response, APIErrors.NOT_FOUND);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleError = (error: Error, _request: Request, response: Response, _next: NextFunction) => {
    this.logger.error(error);

    API.sendError(response, APIErrors.GENERAL_ERROR);
  };
}
