import {fastify} from "fastify";
import { fastifyCors } from "@fastify/cors";
import {validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform} from 'fastify-type-provider-zod'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { routes } from "./routes.js";
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {origin: '*'} )
app.register(fastifySwagger,{
    openapi:{
        info:{
            title: "Minha API ",
            version:"1.0.",
        }
    },
    transform:jsonSchemaTransform
    
})

app.register(fastifySwaggerUi,{
    routePrefix: "/docs",
})

app.register(routes);

app.get('/', () => {
    return "Olá minha primeira API documentada pelo Swagger";
})

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server está rodando em http://localhost:3333`)
  console.log(`Documentação disponível em http://localhost:3333/docs`)
})