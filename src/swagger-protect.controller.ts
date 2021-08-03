import { Body, Controller, Get, Inject, Post, Redirect } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SwaggerProtectOptions, SWAGGER_PROTECT_OPTIONS } from '.'
import { SwaggerProtectLogInDto } from './dto/login.dto'

@ApiTags('swagger-protect')
@Controller('login-api')
export class SwaggerProtectController {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}
  @Get()
  @Redirect('/login-api/index.html')
  entry(): void {
    // redirect to index.html
  }

  @Post()
  async post(@Body() data: SwaggerProtectLogInDto): Promise<{ token: string }> {
    if (this.options.logIn) {
      return await this.options.logIn(data)
    } else {
      throw new Error('logIn not implement in module swagger-protect')
    }
  }
}
