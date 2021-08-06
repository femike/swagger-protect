import { HttpStatus } from '@nestjs/common'
import type { FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import type { FastifyReply } from 'fastify/types/reply'
import type { RouteGenericInterface } from 'fastify/types/route'
import * as router from 'find-my-way'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Server } from 'http'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
} from './constatnt'
import type { SwaggerGuard } from './types'

type Request = FastifyRequest<
  RouteGenericInterface,
  Server,
  IncomingMessage
> & { cookies: { [x: string]: string } }

/**
 * @param cookieGuard Function - Callback function validate token must return boolean.
 * @param swaggerPath string - To register a parametric path,
 * use the colon before the parameter name. For wildcard, use the star.
 * Remember that static routes are always checked before parametric and wildcard.
 * - Sensetive ignored by default
 * - Trailing slash ignored by default
 * @param loginPath string - Redirect path on fail validate token.
 * @param cookieKey string - Cookie key where stored token.
 */
function middleware(settings: {
  guard: SwaggerGuard
  loginPath?: string
  cookieKey?: string
  swaggerPath?: string
}): (
  req: Request,
  reply: FastifyReply,
  next: HookHandlerDoneFunction,
) => void | FastifyReply {
  return (req: Request, reply: FastifyReply, next: HookHandlerDoneFunction) => {
    const myWay = router({
      ignoreTrailingSlash: true,
      caseSensitive: false,
      defaultRoute: () => next(),
      onBadUrl: () => next(),
    })
    myWay.on(
      ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      settings.swaggerPath || ENTRY_POINT_PROTECT,
      async () => {
        const token =
          req.cookies[settings.cookieKey || SWAGGER_COOKIE_TOKEN_KEY]
        if (token) {
          if (typeof settings.guard === 'function') {
            if (await settings.guard(token)) return next()
          } else if (typeof settings.guard === 'object') {
            if (await settings.guard.canActivate(token)) return next()
          }
        }

        const url =
          (settings.loginPath || REDIRECT_TO_LOGIN) +
          `?backUrl=${escape(req.url)}`

        return reply.status(HttpStatus.FOUND).redirect(url)
      },
    )
    return myWay.lookup(
      req as unknown as IncomingMessage,
      reply as unknown as ServerResponse,
    )
  }
}

/**
 * Fastify Middleware Swagger Protect 
 * @example
 * ```typescript
 * // ./src/main.ts
 * import { fastifyProtectSwagger } from '@femike/swagger-protect'
 * import { getConnection } from 'typeorm'

 * fastifyAdapter.getInstance().addHook('onRequest', fastifyProtectSwagger({
 *    guard: token =>
 *      getConnection()
 *        .getRepository(TokenEntity)
 *        .findOneOrFail(token)
 *        .then(t => t.token === token),
 *    cookieKey: 'swagger_token',
 *    swaggerPath: '/api',
 *    loginPath: '/login-api'
 * }))
 *
 * ```
 * @alias middleware
 */
export const fastifyProtectSwagger = middleware

/**
 * Express Middleware Swagger Protect
 * @example
 * ```typescript
 * // ./src/main.ts
 * import { expressProtectSwagger } from '@femike/swagger-protect'
 * import { getConnection } from 'typeorm'
 *
 * app.use(expressProtectSwagger({
 *    guard: token =>
 *      getConnection()
 *        .getRepository(TokenEntity)
 *        .findOneOrFail(token)
 *        .then(t => t.token === token),
 *    cookieKey: 'swagger_token',
 *    swaggerPath: '/api',
 *    loginPath: '/login-api'
 * }))
 *
 * ```
 * @alias middleware
 */
export const expressProtectSwagger = middleware
