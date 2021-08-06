import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  SWAGGER_PROTECT_OPTIONS,
  REDIRECT_TO_LOGIN,
  ENTRY_POINT_PROTECT,
} from '.'
import { SwaggerProtectLogInDto } from './dto/login.dto'
import type { Response } from 'express'
import type { SwaggerProtectOptions } from './types'

@ApiTags('swagger-protect')
@Controller('login-api')
export class SwaggerProtectController {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}
  @Get()
  entry(@Res() res: Response, @Query('backUrl') backUrl: string): void {
    return res
      .status(HttpStatus.FOUND)
      .redirect(
        `${this.options.loginPath || REDIRECT_TO_LOGIN}/index.html?backUrl=${
          backUrl || this.options.swaggerPath || ENTRY_POINT_PROTECT
        }`,
      )
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  post(@Body() data: SwaggerProtectLogInDto):
    | Promise<{
        token: string
      }>
    | undefined {
    if (typeof this.options.logIn !== 'undefined') {
      if (typeof this.options.logIn === 'function') {
        return this.options.logIn(data)
      } else if (typeof this.options.logIn === 'object') {
        return this.options.logIn.execute(data)
      }
    } else {
      throw new BadRequestException(
        'logIn not implement in module swagger-protect, contact with system administrator resolve this problem.',
      )
    }
  }
}
