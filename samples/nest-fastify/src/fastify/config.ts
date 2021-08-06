import { FastifyAdapter } from '@nestjs/platform-fastify'
import { fastifyCookie } from 'fastify-cookie'

const fastifyAdapter = new FastifyAdapter({
  logger: { level: 'error' },
})

fastifyAdapter.register(fastifyCookie)

export default fastifyAdapter
