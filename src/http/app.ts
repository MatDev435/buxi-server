import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { registerUserRoute } from './routes/users/register-user'
import { ZodError } from 'zod'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(registerUserRoute)

app.setErrorHandler((err, _, reply) => {
  if (err instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: err.format() })
  }

  console.log(err)

  return reply.status(500).send({ message: 'Internal server error' })
})
