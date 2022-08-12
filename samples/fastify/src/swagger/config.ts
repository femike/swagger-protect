import fastifySwagger from '@fastify/swagger'
import { fastifyCookie } from '@fastify/cookie'
import { fastifyProtectSwagger } from '@femike/swagger-protect'
//
import type { FastifyInstance } from 'fastify'
//
import { SwaggerGuard } from './guard'

export const SWAGGER_PATH = 'api'

export function createSwagger(app: FastifyInstance): FastifyInstance {
  app.register(fastifySwagger, {
    routePrefix: SWAGGER_PATH,
    swagger: {
      info: {
        title: 'Swagger Example',
        description: 'swagger example openapi API',
        version: '2.0',
      },
      produces: ['text/html', 'application/json', 'application/xml'],
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: header => header,
    exposeRoute: true,
  })

  app.register(fastifyCookie)

  app.addHook(
    'onRequest',
    fastifyProtectSwagger({
      guard: new SwaggerGuard(),
      cookieKey: 'swagger_token',
      loginPath: '/login-api',
      swaggerPath: /^\/api\/(json|static\/index.html)(?:\/)?$/,
    }),
  )

  return app
}
