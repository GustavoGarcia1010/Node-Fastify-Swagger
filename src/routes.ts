import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { FastifyTypedInstance } from "./types.js";

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

const userParamsSchema = z.object({
  id: z.string().uuid(),
});

const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
});

//crio as rotas e exporto 
export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/users",
    {
      schema: {
        tags: ["usuarios"],
        description: "Lista de usuários",
        response: {
          200: z.array(userResponseSchema),
        },
      },
    },
    (request, response) => {
      return usuarios; // retorna o payload direto, sem .send() — evita o erro de tipo do FastifyReply
    }
  );

  app.post(
    "/users",
    {
      schema: {
        tags: ["usuarios"],
        description: "Criar um novo Usuário",
        body: createUserBodySchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    (request, response) => {
      const { name, email } = request.body; // já validado e tipado pelo schema, sem precisar de .parse()

      const newUser: User = {
        id: randomUUID(),
        name,
        email,
      };

      usuarios.push(newUser);

      response.status(201); // status definido separadamente
      return newUser;        // retorna só o payload, não o resultado de .send()
    }
  );

  app.get(
    "/users/:id",
    {
      schema: {
        tags: ["usuarios"],
        description: "Listar usuário por ID",
        params: userParamsSchema,
        response: {
          200: userResponseSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, response) => {
      const { id } = request.params; // já tipado como string (UUID)

      const usuario = usuarios.find((u) => u.id === id); // busca no array em memória

      if (!usuario) {
        response.code(404);
        return { message: "Usuário não encontrado" };
      }

      return usuario;
    }
  );
}