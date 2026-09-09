import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { routes } from "./infra/http/Router/routes.js";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//reegistro o cors para conseguir receber requisições de outros domínios
app.register(fastifyCors, { origin: "*" });
//registro o swagger para a documentação da API
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Minha API ",
      version: "1.0.",
    },
  },
  //habilito o uso do Schema para mim conseguir ter a visão na documentação do body da API
  transform: jsonSchemaTransform,
});

//registro a rota padrão para mim ver a documentação da API em localhost:3333/docs
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

//registro as rotas cadastradas no arquivo src/routes.ts
app.register(routes);

//crio a rota health para verificar o status da minha API (ativa ou desativada)
app.get("/health", async () => {
  return { status: "API rodando com sucesso!" };
});

//finalmente ativo o servidor na porta 3333 e no localhost (ip depender da máquina (host))
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server está rodando em http://localhost:3333`);
  console.log(`Documentação disponível em http://localhost:3333/docs`);
});
