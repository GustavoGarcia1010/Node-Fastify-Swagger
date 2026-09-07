import z from "zod";
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

//crio a interface de usuário 
interface User {
  id: string;
  name: string;
  email: string;
}


//criei o array/lista de usuário seguindo a tipagem da interface
const usuarios: User[] = [];


//etapa importante, eu crio o esqueleto do corpo da requisição, definindo os campos e a regra de tipagem
const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
});


//crio as rotas e exporto 
export async function routes(app: FastifyInstance) {
  app.get(
    '/users',
    {
      schema: {
        tags: ['usuarios'],
        description: 'Lista de usuários',
      },
    },
    (request, response) => {
      return response.status(200).send(usuarios);
    }
  );

  app.post(
    '/users',
    {
      schema: {
        tags: ['usuarios'],
        description: 'Criar um novo Usuário',
        body: createUserBodySchema,
      },
    },
    (request, response) => {
      const { name, email } = createUserBodySchema.parse(request.body);

      const newUser: User = {
        id: randomUUID(),
        name,
        email,
      };

      usuarios.push(newUser);

      return response.status(201).send(newUser);
    }
  );
}