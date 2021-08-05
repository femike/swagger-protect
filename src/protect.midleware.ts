import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import {
  REDIRECT_TO_LOGIN,
  SwaggerProtectOptions,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_PROTECT_OPTIONS,
} from '.'

@Injectable()
export class ProtectMiddleware implements NestMiddleware {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    debugger
    const token =
      req.cookies[this.options.cookieKey || SWAGGER_COOKIE_TOKEN_KEY]
    if (token) {
      if (typeof this.options.guard === 'function') {
        if (await this.options.guard(token)) next()
      } else if (typeof this.options.guard === 'object') {
        if (await this.options.guard.canActivate(token)) next()
      }
    }
    res
      .status(HttpStatus.FOUND)
      .redirect(
        `${this.options.loginPath || REDIRECT_TO_LOGIN}?backUrl=${
          req.originalUrl
        }`,
      )
  }
}
