import { resolve } from 'node:path'
import { fastify } from 'fastify'
import fastifyStatic from '@fastify/static'
import { SwaggerProtectLogInDto } from '@femike/swagger-protect/dist/dto/login.dto'
//
import type { FastifyInstance, FastifyBaseLogger } from 'fastify'
import type { IncomingMessage, Server, ServerResponse } from 'http'
import type { SwaggerLoginMock } from './mocks/login'
//
import { createSwagger } from './swagger'
import { SwaggerGuardMock } from './mocks/guard'

export type FastifyApp = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger
>

const html = `Home Page <a href="/api">API</a>`

export async function bootstrap(
  settings: {
    cookieKey: string
    loginPath: string
    swaggerPath: RegExp
  },
  swaggerLogin: SwaggerLoginMock,
  swaggerGuard: SwaggerGuardMock,
): Promise<FastifyApp> {
  const app = fastify({
    logger: false,
  })
  const application = createSwagger(settings, app, swaggerGuard)

  application.register(fastifyStatic, {
    root: resolve(__dirname, '../node_modules/@femike/swagger-protect-ui/dist'),
    prefix: settings.loginPath,
    decorateReply: false,
  })

  application.get<{ Querystring: { backUrl: string } }>(
    settings.loginPath,
    (req, reply) => {
      reply
        .status(302)
        .redirect(
          `${settings.loginPath}/index.html?backUrl=${
            req.query.backUrl || '/api'
          }`,
        )
    },
  )

  application.post<{
    Body: SwaggerProtectLogInDto
  }>(
    settings.loginPath,
    {
      schema: {
        body: {
          type: 'object',
          required: ['login', 'password'],
          properties: {
            login: {
              type: 'string',
              minLength: 3,
            },
            password: {
              type: 'string',
              minLength: 8,
            },
          },
        },
      },
    },
    async (req, reply) => {
      const { login, password } = req.body
      const loginDto = new SwaggerProtectLogInDto(login, password)
      const { token } = await swaggerLogin.execute(loginDto)
      if (token !== '') return reply.status(201).send({ token })
      else reply.status(403).send({ message: 'Forbidden' })
    },
  )

  application.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'string',
            example: html,
          },
        },
      },
    },
    (_, reply) => {
      reply.header('Content-Type', 'text/html; charset=utf-8').send(html)
    },
  )

  return application
}

export default bootstrap
