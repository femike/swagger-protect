import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import { SwaggerProtectLogInDto } from './dto/login.dto'
import { ProtectMiddleware } from './protect.midleware'
import { SwaggerProtectController } from './swagger-protect.controller'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

export type SwaggerGuard = (token: string) => boolean | Promise<boolean>

/**
 * SwaggerProtectOptions
 */
export interface SwaggerProtectOptions {
  guard: SwaggerGuard
  swaggerPath: string
  loginPath: string
  cookieKey: string
  useUI: boolean
  logIn?: (data: SwaggerProtectLogInDto) => Promise<{ token: string }>
}

/**
 * Swagger Protect Core
 */
@Module({})
export class SwaggerProtectCore {
  static forRoot(
    options: SwaggerProtectOptions = {
      cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
      loginPath: REDIRECT_TO_LOGIN,
      swaggerPath: ENTRY_POINT_PROTECT,
      guard: (token: string) => !!token,
      useUI: true,
    },
  ): DynamicModule {
    const moduleOptions = {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: options,
    }
    return {
      module: SwaggerProtectCore,
      imports:
        options.useUI && options.loginPath === ENTRY_POINT_PROTECT
          ? [
              ServeStaticModule.forRoot({
                rootPath: join(__dirname, '..', 'client'),
              }),
            ]
          : [],
      providers: [moduleOptions],
      exports: [moduleOptions],
      controllers:
        options.useUI && options.loginPath === ENTRY_POINT_PROTECT
          ? [SwaggerProtectController]
          : [],
    }
  }
}

/**
 * Swagger Protect
 */
@Module({})
export class SwaggerProtect implements NestModule {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ProtectMiddleware).forRoutes(this.options.swaggerPath)
  }

  forRoot(options: SwaggerProtectOptions): DynamicModule {
    return {
      module: SwaggerProtect,
      imports: [SwaggerProtectCore.forRoot(options)],
    }
  }
}
