import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import type { Response } from 'express'
import { URL } from 'url'
import type { SwaggerProtectOptions } from './types'

@Injectable()
export class SwaggerGuard implements CanActivate {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { cookies, req } = ctx.switchToHttp().getRequest()

    const path = this.options.swaggerPath || ENTRY_POINT_PROTECT

    if (req.originalUrl.startsWith(path)) {
      const token = cookies[this.options.cookieKey || SWAGGER_COOKIE_TOKEN_KEY]
      if (token) {
        if (typeof this.options.guard === 'function') {
          if (await this.options.guard(token)) return true
        } else if (typeof this.options.guard === 'object') {
          if (await this.options.guard.canActivate(token)) return true
        }
      }

      const response = ctx.switchToHttp().getResponse<Response>()
      const url = new URL(this.options.loginPath || REDIRECT_TO_LOGIN, '')
      url.search = `backUrl=${escape(req.originalUrl)}`

      console.debug([url.href, url.origin, url.toString()])

      response.status(HttpStatus.FOUND).redirect(url.href)
    }

    return true
  }
}
