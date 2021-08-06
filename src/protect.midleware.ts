import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request } from 'express'
import type { ServerResponse } from 'http'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import { parse } from 'cookie'
import { escape } from 'querystring'
import type { SwaggerProtectOptions } from './types'

@Injectable()
export class ProtectMiddleware implements NestMiddleware {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}
  async use(
    req: Request,
    res: ServerResponse,
    next: NextFunction,
  ): Promise<void> {
    console.debug([req.originalUrl, this.options.swaggerPath])

    if (
      req.originalUrl.startsWith(
        this.options.swaggerPath || ENTRY_POINT_PROTECT,
      )
    ) {
      const cookies = req.cookies || parse(req.headers.cookie || '')
      const token = cookies[this.options.cookieKey || SWAGGER_COOKIE_TOKEN_KEY]
      if (token) {
        if (typeof this.options.guard === 'function') {
          if (await this.options.guard(token)) return next()
        } else if (typeof this.options.guard === 'object') {
          if (await this.options.guard.canActivate(token)) return next()
        }
      }

      const url =
        (this.options.loginPath || REDIRECT_TO_LOGIN) +
        `?backUrl=${escape(req.originalUrl)}`

      return res
        .writeHead(HttpStatus.FOUND, {
          location: url,
        })
        .end()
    }

    return next()
  }
}
