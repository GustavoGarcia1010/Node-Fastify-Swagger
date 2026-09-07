import {fastify} from "fastify";
import { fastifyCors } from "@fastify/cors";
import {validatorCompiler, serializerCompiler} from 'fastify-type-provider-zod'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {origin: '*'} )
app.register(fastifySwagger,{
    openapi:{
        info:{
            title: "Minha API ",
            version:"1.0.",
        }
    }
    
})

app.register(fastifySwaggerUi,{
    routePrefix: "/docs",
})

app.get('/', () => {
    return "Olá minha primeira API documentada pelo Swagger";
})

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server está rodando em http://localhost:3333`)
  console.log(`Documentação disponível em http://localhost:3333/docs`)
})