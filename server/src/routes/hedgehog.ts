import {
  getAllHedgehogs,
  getHedgehogById,
  insertHedgehog,
  deleteHedgehogById,
} from "@server/application/hedgehog";
import { hedgehogSchema } from "@ubigu/shared/src/hedgehog";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export function hedgehogRouter(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", async function (_request, reply) {
    try {
      const hedgehogs = await getAllHedgehogs();

      if (hedgehogs && hedgehogs.length) {
        const ids = hedgehogs.map((hedgehog) => hedgehog.id);
        return reply.code(200).send({ ids });
      }
    } catch (error) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

  fastify.post("/", async function (_request, reply) {
    try {
      const params = await _request.body;
      const id = await insertHedgehog(hedgehogSchema.parse(params));

      return id
        ? reply.code(201).send({ success: true, id })
        : reply
            .code(409)
            .send({ success: false, message: "failed to process request" });
    } catch (error) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

  fastify.get("/:id", async function (_request, reply) {
    const param = (await _request.params) as { id: string };
    try {
      const id = Number.isInteger(Number(param.id)) && Number(param.id);
      const hedgehog = id && (await getHedgehogById(id));

      if (hedgehog) {
        return reply.code(200).send({ success: true, hedgehog });
      } else {
        return reply.code(404).send({ succes: false });
      }
    } catch (error) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

  fastify.delete("/:id", async function (request, reply) {
    const param = request.params as { id: string };
    try {
      const id = Number.isInteger(Number(param.id)) && Number(param.id);

      if (!id) {
        return reply.code(400).send({ success: false, error: "Invalid ID" });
      }

      const deleted = await deleteHedgehogById(id);

      if (deleted) {
        return reply
          .code(200)
          .send({ success: true, message: "Hedgehog deleted successfully" });
      } else {
        return reply
          .code(404)
          .send({ success: false, error: "Hedgehog not found" });
      }
    } catch (error) {
      console.error(error);
      return reply
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

  // Catch-all route for 404 errors
  fastify.setNotFoundHandler(async function (_request, reply) {
    return reply
      .status(404)
      .send({ success: false, error: "Resource not found" });
  });

  done();
}
