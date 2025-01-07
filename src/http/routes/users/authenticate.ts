import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeAuthenticate } from '../../../use-cases/users/factories/make-authenticate'
import { InvalidCredentialsError } from '../../../use-cases/_errors/invalid-credentials-error'

export const authenticateRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/register',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      try {
        const registerUser = makeAuthenticate()

        registerUser.execute({
          email,
          password,
        })

        return reply.status(201).send()
      } catch (err) {
        if (err instanceof InvalidCredentialsError) {
          return reply.status(401).send({ message: 'Credenciais inválidas.' })
        }

        return err
      }
    }
  )
}
