import { healthRouter } from "./health";
import { hedgehogRouter } from "./hedgehog";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export function routes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: () => void
) {
  fastify.register(healthRouter, { prefix: "/health" });
  fastify.register(hedgehogRouter, { prefix: "/hedgehog" });

  // Simulate slow response for all routes
  // fastify.addHook("onRequest", (request, reply, done) => {
  //   const delay = 2000;
  //   setTimeout(() => {
  //     done();
  //   }, delay);
  // });

  done();
}
