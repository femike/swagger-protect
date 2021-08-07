import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common'
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_LOGIN,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import { SwaggerProtectLogInDto } from './dto/login.dto'
import { SwaggerLoginInterface } from './interfaces'
import type { SwaggerProtectOptions } from './types'

@ApiTags('swagger-protect')
@Controller('login-api')
export class SwaggerProtectController {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
    @Inject(SWAGGER_LOGIN)
    private readonly logIn: SwaggerLoginInterface,
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
  @ApiForbiddenResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  post(@Body() data: SwaggerProtectLogInDto):
    | Promise<{
        token: string
      }>
    | undefined {
    if (typeof this.logIn !== 'undefined') {
      return this.logIn
        .execute(data)
        .then(result => {
          if (!result.token) throw new ForbiddenException()
          else return result
        })
        .catch(err => {
          throw err
        })
    } else {
      throw new BadRequestException(
        'logIn not implement in module swagger-protect, contact with system administrator resolve this problem.',
      )
    }
  }
}
