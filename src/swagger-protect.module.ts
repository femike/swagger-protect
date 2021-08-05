import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import {
  ServeStaticModule,
  serveStaticProviders,
  SERVE_STATIC_MODULE_OPTIONS,
} from '@nestjs/serve-static'
import { join } from 'path'
import {
  ENTRY_POINT_PROTECT,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import { SwaggerProtectLogInDto } from './dto/login.dto'
import type { SwaggerLoginInterface, SwaggerGuardInterface } from './interfaces'
import { ProtectMiddleware } from './protect.midleware'
import { SwaggerProtectController } from './swagger-protect.controller'

export type SwaggerGuard =
  | SwaggerGuardInterface
  | ((token: string) => boolean | Promise<boolean>)
export type SwaggerLogin =
  | SwaggerLoginInterface
  | ((data: SwaggerProtectLogInDto) => Promise<{ token: string }>)

/**
 * SwaggerProtectOptions
 */
export interface SwaggerProtectOptions {
  guard: SwaggerGuard
  logIn: SwaggerLogin
  swaggerPath?: string
  loginPath?: string
  cookieKey?: string
  useUI?: boolean
}

/**
 * Swagger Protect Core
 */
@Module({})
export class SwaggerProtectCore {
  static forRoot(
    options: SwaggerProtectOptions = {
      guard: (token: string) => !!token,
      logIn: async () => ({ token: '' }),
      cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
      loginPath: REDIRECT_TO_LOGIN,
      swaggerPath: ENTRY_POINT_PROTECT,
      useUI: true,
    },
  ): DynamicModule {
    const moduleOptions = {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: options,
    }

    const staticOptions = {
      provide: SERVE_STATIC_MODULE_OPTIONS,
      useValue: {
        rootPath: join(__dirname, '..', 'ui/dist'),
      },
    }

    return {
      module: SwaggerProtectCore,
      providers: [moduleOptions, staticOptions, ...serveStaticProviders],
      exports: [moduleOptions, staticOptions],
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
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ui/dist'),
      renderPath: REDIRECT_TO_LOGIN + '/*',
      serveRoot: REDIRECT_TO_LOGIN,
    }),
  ],
  providers: [
    {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: {
        guard: (token: string) => !!token,
        logIn: async () => ({ token: '' }),
        cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
        loginPath: REDIRECT_TO_LOGIN,
        swaggerPath: ENTRY_POINT_PROTECT,
        useUI: true,
      } as SwaggerProtectOptions,
    },
  ],
  controllers: [SwaggerProtectController],
})
export class SwaggerProtect implements NestModule {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
  ) {}

  /**
   * Configure middleware
   */
  configure(consumer: MiddlewareConsumer): void {
    const path = this.options.swaggerPath || ENTRY_POINT_PROTECT
    consumer.apply(ProtectMiddleware).forRoutes(path.replace(/\*$/, '') + '*')
  }

  /**
   *
   * @example
   * ```
   * ~@Module({
   *  imports: [
   *    SwaggerProtect.forRoot({
   *      guard: new SwaggerGuard(),
   *      logIn: new SwaggerLogin(),
   *    })
   *  ]
   * })
   * export class AppModule {}
   * ```
   */
  public static forRoot(options: SwaggerProtectOptions): DynamicModule {
    return {
      module: SwaggerProtect,
      imports: [SwaggerProtectCore.forRoot(options)],
    }
  }
}
