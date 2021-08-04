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

type Request = FastifyRequest<
  RouteGenericInterface,
  Server,
  IncomingMessage
> & { cookies: { [x: string]: string } }

/**
 *
 * @example
 * ```typescript
 * import { fastifyProtectSwagger } from '@femike/swagger-protect'
 *
 * fastifyAdapter.getInstance().addHook('onRequest', fastifyProtectSwagger({
 *    cookieGuard: token =>
 *      getConnection()
 *        .getRepository(TokenEntity)
 *        .findOneOrFail(token)
 *        .then(t => t.token === token),
 *    cookieKey: 'swagger_token',
 *    entryPath: '/api',
 *    redirectPath: '/login-api'
 * }))
 *
 * ```
 * @param cookieGuard Function - Callback function validate token must return boolean.
 * @param entryPath string - To register a parametric path,
 * use the colon before the parameter name. For wildcard, use the star.
 * Remember that static routes are always checked before parametric and wildcard.
 * - Sensetive ignored by default
 * - Trailing slash ignored by default
 * @param redirectPath string - Redirect path on fail validate token.
 * @param cookieKey string - Cookie key where stored token.
 */
export function fastifyProtectSwagger(settings: {
  cookieGuard: (token: string) => boolean | Promise<boolean>
  redirectPath?: string
  cookieKey?: string
  entryPath?: string
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
      settings.entryPath || ENTRY_POINT_PROTECT,
      async () => {
        const token =
          req.cookies[settings.cookieKey || SWAGGER_COOKIE_TOKEN_KEY]
        if (token) {
          if (await settings.cookieGuard(token)) return next()
        }

        return reply
          .status(HttpStatus.FOUND)
          .redirect(settings.redirectPath || REDIRECT_TO_LOGIN)
      },
    )
    return myWay.lookup(
      req as unknown as IncomingMessage,
      reply as unknown as ServerResponse,
    )
  }
}

export default fastifyProtectSwagger
