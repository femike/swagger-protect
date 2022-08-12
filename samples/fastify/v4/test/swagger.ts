import { fastifyProtectSwagger } from '@femike/swagger-protect'
import fastifySwagger from '@fastify/swagger'
import { fastifyCookie } from '@fastify/cookie'
//
import type { FastifyApp } from './bootstrap'
//
import { SwaggerGuardMock } from './mocks/guard'

export const SWAGGER_PATH = 'api'

export function createSwagger(
  settings: {
    cookieKey: string
    loginPath: string
    swaggerPath: RegExp
  },
  app: FastifyApp,
  swaggerGuard: SwaggerGuardMock,
): FastifyApp {
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
      guard: swaggerGuard,
      cookieKey: settings.cookieKey,
      loginPath: settings.loginPath,
      swaggerPath: settings.swaggerPath,
    }),
  )

  return app
}
