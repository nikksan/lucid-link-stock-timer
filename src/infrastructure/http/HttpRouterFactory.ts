import { Router as ExpressRouter, Router as createExpressRouter } from "express";
import HttpController from "./HttpController";

export default class HttpRouterFactory {
  constructor(
    private httpController: HttpController,
  ) {}

  create(): ExpressRouter {
    const router = createExpressRouter();

    router.get('/calculateEntryAndExit', this.httpController.calculateEntryAndExit);

    return router;
  }
}
