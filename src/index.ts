import HttpServer from '@infrastructure/http/HttpServer';
import container from './root'

(async () => {
  const httpServer = container.resolve<HttpServer>('httpServer');
  await httpServer.start();
})();

