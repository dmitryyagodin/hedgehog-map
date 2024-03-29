import { getAllHedgehogs, getHedgehogById, insertHedgehog } from "@server/application/hedgehog";
import { hedgehogSchema } from '@ubigu/shared/src/hedgehog';
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
        const ids = hedgehogs.map(hedgehog => hedgehog.id);
        return reply.code(200).send({ids});
      }

    } catch (error) {
      console.error(error)
      return reply.status(500).send({ success: false, error: "Internal Server Error" });
    }

  });

  fastify.put("/", async function (_request, reply) {
    try {
        const params = await _request.body;        
        const id = await insertHedgehog(hedgehogSchema.parse(params));
        return reply.code(200).send({ success: true, id });

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ success: false, error: "Internal Server Error" });
    }
  });


  fastify.get("/:id", async function (_request, reply) {
    const param = await _request.params as {id: string};
    try {
      if (parseInt(param.id)) {
        const hedgehog = await getHedgehogById(parseInt(param.id));
        return reply.code(200).send({ success: true, hedgehog });
      }
      throw Error('Indvalid request')
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ success: false, error: "Internal Server Error"});
    }
  });

  done();
}
