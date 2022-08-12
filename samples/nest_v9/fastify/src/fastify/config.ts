import { FastifyAdapter } from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import { SWAGGER_COOKIE_TOKEN_KEY } from '@femike/swagger-protect'

import type { FastifyCookieOptions } from '@fastify/cookie'

const fastifyAdapter = new FastifyAdapter({
  logger: { level: 'error' },
})

fastifyAdapter.register(fastifyCookie, {
  secret: SWAGGER_COOKIE_TOKEN_KEY,
  parseOptions: {},
} as FastifyCookieOptions)

export default fastifyAdapter
