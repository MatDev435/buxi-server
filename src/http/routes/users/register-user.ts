import { FastifyInstance } from 'fastify'
import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeRegisterUser } from '../../../use-cases/users/factories/make-register-user'
import { UserAlreadyExistsError } from '../../../use-cases/_errors/user-already-exists-error'

export const registerUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/register',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      try {
        const registerUser = makeRegisterUser()

        registerUser.execute({
          name,
          email,
          password,
        })

        return reply.status(201).send()
      } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
          return reply
            .status(409)
            .send({ message: 'Esse e-mail já está em uso.' })
        }

        return err
      }
    }
  )
}
