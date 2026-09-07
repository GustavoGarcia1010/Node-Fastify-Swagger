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

//aqui eu crio o esquema para usar de modelos nos parâmetros vindo da URL em formato de QUERY
const userParamsSchema = z.object({
  id: z.string().uuid(),
});


//construção do modelo do schema para retornar os usuários 
const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
});


//construção do modelo do schema para alteração de dados dos usuários
const userUpdateSchema = z.object({
  name: z.string(),
  email: z.email(),
})

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

      const novoUsuario: User = {
        id: randomUUID(),
        name,
        email,
      };

      usuarios.push(novoUsuario);

      response.status(201); // status definido separadamente
      return novoUsuario;        // retorna só o payload, não o resultado de .send()
    }
  );

  app.put(
    "/usuarios/:id",
    {
      schema:{
        tags:['usuarios'],
        description:("Alteração dos dados dos usuários"),
        params: userParamsSchema,
        body: userUpdateSchema,
        response: {
          200 : userResponseSchema,
          404 : z.object({message: z.string()})
        },
      },
    },
    async(request, response) => {
       const { id } = request.params;
       const {name, email} = request.body;

      const usuarioSelecionado = usuarios.find((u) => u.id == id);

      if(!usuarioSelecionado){
      response.code(404);
      return {message: "Usuário não encontrado!"}
      }

      usuarioSelecionado.name = name || usuarioSelecionado.name;
      usuarioSelecionado.email = email || usuarioSelecionado.email;


      response.code(200);
      return usuarioSelecionado;

    }
  )

  

  app.delete(
    "/users/:id",
    {
      schema:{
        tags:['usuarios'],
        description: "Deletar usuário por ID",
        params: userParamsSchema,
        response:{
          204: z.null(),
          404: z.object({message: z.string()})
        },
      },
    },
    async(request, response) => {
      const { id } = request.params;

      const usuarioIndex = usuarios.findIndex((u) => u.id === id);


      if(usuarioIndex === -1){
        response.code(404);
        return{ message: "Usuário não encontrado"};
      }


      usuarios.splice(usuarioIndex, 1);
      response.code(204);
      return null;
    
    }
  );

  
}