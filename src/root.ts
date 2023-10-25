import { InjectionMode, asClass, asValue, createContainer } from 'awilix';
import { loadConfig, isTesting } from './config';
import LoggerFactory from '@infrastructure/logger/LoggerFactory';
import PostgresPriceHistoryReadModel from '@infrastructure/database/read-model/PostgresPriceHistoryReadModel';
import CalculateEntryAndExitQuery from '@application/CalculateEntryAndExitQuery';
import HttpController from '@infrastructure/http/HttpController';
import HttpServer from '@infrastructure/http/HttpServer';
import HttpRouterFactory from '@infrastructure/http/HttpRouterFactory';
import cluster from 'node:cluster';
import PostgresSolutionCacher from '@infrastructure/database/PostgresSolutionCacher';

const config = loadConfig();

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  rootDir: asValue(__dirname + '/..'),
});

container.register({
  loggerFactory: asClass(LoggerFactory, {
    injector: () => ({
      config: config.log,
      globalPrefix: cluster.isPrimary ? 'PRIMARY' : `WORKER:${process.pid}`,
    }),
  }).singleton(),
});

if (!isTesting) {
  container.register({
    priceHistoryReadModel: asClass(PostgresPriceHistoryReadModel, {
      injector: () => ({
        config: config.db,
      }),
    }).singleton(),
  });

  container.register({
    solutionCacher: asClass(PostgresSolutionCacher, {
      injector: () => ({
        config: config.db,
      }),
    }).singleton(),
  });
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: StubbedPriceHistoryReadModel } = require('../tests/util/StubbedPriceHistoryReadModel');
  container.register({
    priceHistoryReadModel: asClass(StubbedPriceHistoryReadModel).singleton(),
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: FakeSolutionCacher } = require('../tests/util/FakeSolutionCacher');

  container.register({
    solutionCacher: asClass(FakeSolutionCacher).singleton(),
  });
}

container.register({
  calculateEntryAndExitQuery: asClass(CalculateEntryAndExitQuery),
});

container.register({
  httpController: asClass(HttpController),
});

container.register({
  httpRouterFactory: asClass(HttpRouterFactory),
});


container.register({
  httpServer: asClass(HttpServer, {
    injector: () => ({
      config: config.server,
    }),
  }),
});

export default container;
