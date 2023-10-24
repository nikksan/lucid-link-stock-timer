import express, { NextFunction, Request, Response, Router, static as staticRoute, Application } from 'express';
// import compression from 'compression';
// import bodyParser from 'body-parser';
import { Server } from 'http';
// import { isEmpty } from 'lodash';
// import API from '@infrastructure/api/API';
// import APIErrors from '@infrastructure/api/APIErrors';
// import MainRouterFactory from '@infrastructure/routes/MainRouterFactory';
import { Logger } from '@infrastructure/logger/Logger';
import { Config } from '@config/Config';
import LoggerFactory from '@infrastructure/logger/LoggerFactory';
import RouterFactory from './HttpRouterFactory';
import API from './API';
import APIErrors from './APIErrors';
import HttpRouterFactory from './HttpRouterFactory';

export default class HttpServer {
  private logger: Logger;
  private app = express();
  private router: Router;

  constructor(
    private config: Config['server'],
    // private rootDir: string,
    httpRouterFactory: HttpRouterFactory,
    loggerFactory: LoggerFactory,
  ) {
    this.router = httpRouterFactory.create();
    this.logger = loggerFactory.create(this.constructor.name);

    this.app.use(this.router);
    this.app.use(this.send404);
    this.app.use(this.handleError);
  }

  start(): Promise<void> {
    // this.app.use(bodyParser.json(this.config.bodyParser.json));
    // this.app.use(bodyParser.urlencoded(this.config.bodyParser.urlencoded));
    // this.app.use(compression());

    // this.app.use(this.handleContentType);

    // if (this.config.exposeDocs) {
    //   this.app.use('/docs', staticRoute(this.rootDir + '/docs'));
    // }

    // if (this.config.enableCORS) {
    //   this.app.use(this.allowCORS);
    // }


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

  // private handleContentType = (request: Request, response: Response, next: NextFunction) => {
  //   if (
  //     request.method === 'GET' ||
  //     request.method === 'OPTIONS' ||
  //     (request.method === 'DELETE' && isEmpty(request.body)) ||
  //     (request.method === 'POST' && isEmpty(request.body))
  //   ) {
  //     return next();
  //   }

  //   if (!request.is('application/json')) {
  //     return API.sendError(response, APIErrors.INVALID_CONTENT_TYPE);
  //   }

  //   next();
  // };

  // private allowCORS = (request: Request, response: Response, next: NextFunction) => {
  //   response.header('Access-Control-Allow-Credentials', 'true');
  //   response.header('Access-Control-Allow-Origin', request.headers.origin);
  //   response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, DELETE, OPTIONS');

  //   const allowedHeaders = [
  //     'Accept',
  //     'Access-Control-Allow-Credentials',
  //     'Access-Control-Allow-Headers',
  //     'Access-Control-Allow-Origin',
  //     'Authorization',
  //     'Content-Type',
  //     'Headers',
  //     'Origin',
  //     'X-HTTP-Method-Override',
  //     'X-Requested-With',
  //   ];

  //   response.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));

  //   next();
  // };

  private send404 = (_request: Request, response: Response) => {
    API.sendError(response, APIErrors.NOT_FOUND);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleError = (error: Error, _request: Request, response: Response, _next: NextFunction) => {
    // // BodyParser error
    // if (error instanceof SyntaxError) {
    //   return API.sendError(response, APIErrors.MALFORMED_REQUEST_BODY);
    // }

    this.logger.error(error);

    API.sendError(response, APIErrors.GENERAL_ERROR);
  };
}
