import { BadRequestException, HttpStatus } from '@nestjs/common'
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'
import type { FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import type { FastifyReply } from 'fastify/types/reply'
import type { RouteGenericInterface } from 'fastify/types/route'
import type { IncomingMessage, Server } from 'http'
// wrong ts exports
import * as pathToRegexp from 'path-to-regexp'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
} from './constatnt'
import type { SwaggerProtectOptions } from './types'

type FastiRequest = FastifyRequest<
  RouteGenericInterface,
  Server,
  IncomingMessage
> & { cookies: { [x: string]: string } }

type Settings = Omit<SwaggerProtectOptions, 'logIn'>

/**
 * @private
 */
function middlewareTest<
  Req extends FastiRequest | ExpressRequest,
  Res extends ExpressResponse | FastifyReply,
>(
  req: Req,
  reply: Res,
  next: HookHandlerDoneFunction,
  settings: Settings,
  url: string,
) {
  try {
    const token = req.cookies[settings.cookieKey || SWAGGER_COOKIE_TOKEN_KEY]
    if (token) {
      if (typeof settings.guard === 'function') {
        if (settings.guard(token)) return next()
        else return reply.status(HttpStatus.FOUND).redirect(url)
      } else if (typeof settings.guard === 'object') {
        return settings.guard
          .canActivate(token)
          .then(result =>
            result ? next() : reply.status(HttpStatus.FOUND).redirect(url),
          )
          .catch(err => {
            throw new BadRequestException(err)
          })
      }
    }
  } catch (err) {
    return reply
      .status(HttpStatus.FOUND)
      .redirect(`${url}&message=${escape(err.message)}`)
  }

  return reply.status(HttpStatus.FOUND).redirect(url)
}

/**
 * @param {Function} cookieGuard  - Callback function validate token must return boolean.
 * @param {string | RegExp} swaggerPath  - To register a parametric path,
 * use the colon before the parameter name. No wildcard asterisk (*) - use parameters instead ((.*) or :splat*).
 * - Sensetive ignored by default
 * @param {string} loginPath - Redirect path on fail validate token.
 * @param {string} cookieKey  - Cookie key where stored token.
 */
function middleware<
  Req extends FastiRequest | ExpressRequest,
  Res extends ExpressResponse | FastifyReply,
>(
  settings: Settings,
): (req: Req, reply: Res, next: HookHandlerDoneFunction) => void | Res {
  return (req: Req, reply: Res, next: HookHandlerDoneFunction) => {
    const url =
      (settings.loginPath || REDIRECT_TO_LOGIN) + `?backUrl=${escape(req.url)}`

    const path = settings.swaggerPath || ENTRY_POINT_PROTECT

    if (path instanceof RegExp) {
      if (path.test(req.url)) middlewareTest(req, reply, next, settings, url)
      else return next()
    } else if (typeof path === 'string') {
      const regexp = pathToRegexp(path)
      if (regexp.test(req.url)) middlewareTest(req, reply, next, settings, url)
      else return next()
    } else {
      throw new Error(`swaggerPath must be a string or RegExp`)
    }
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
