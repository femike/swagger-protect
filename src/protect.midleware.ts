import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import { SwaggerProtectOptions, SWAGGER_PROTECT_OPTIONS } from '.'

@Injectable()
export class ProtectMiddleware implements NestMiddleware {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies[this.options.cookieKey]
    if (token) {
      if (await this.options.guard(token)) next()
    }
    res.status(HttpStatus.FOUND).redirect(this.options.loginPath)
  }
}
