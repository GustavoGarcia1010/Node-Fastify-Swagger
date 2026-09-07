import type { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault, // tipo do servidor HTTP cru por baixo do Fastify (http.Server do Node)
  RawRequestDefaultExpression, // tipo da requisição HTTP crua (IncomingMessage do Node)
  RawReplyDefaultExpression, // tipo da resposta HTTP crua (ServerResponse do Node)
  FastifyBaseLogger, // tipo do logger interno (Pino), pra request.log.info(...) sair tipado
  ZodTypeProvider // o mais importante: diz que os schemas são objetos Zod, não JSON Schema
>;