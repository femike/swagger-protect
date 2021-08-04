import {
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import {
  AbstractLoader,
  ServeStaticModuleOptions,
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
import { ProtectMiddleware } from './protect.midleware'
import { SwaggerProtectController } from './swagger-protect.controller'

export type SwaggerGuard = (token: string) => boolean | Promise<boolean>

/**
 * SwaggerProtectOptions
 */
export interface SwaggerProtectOptions {
  guard: SwaggerGuard
  swaggerPath?: string
  loginPath?: string
  cookieKey?: string
  useUI?: boolean
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
  providers: [
    {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: {
        cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
        loginPath: REDIRECT_TO_LOGIN,
        swaggerPath: ENTRY_POINT_PROTECT,
        guard: (token: string) => !!token,
        useUI: true,
      },
    },
    {
      provide: SERVE_STATIC_MODULE_OPTIONS,
      useValue: {
        rootPath: join(__dirname, '..', 'ui/dist'),
      },
    },
    ...serveStaticProviders,
  ],
})
export class SwaggerProtect implements NestModule, OnModuleInit {
  constructor(
    @Inject(SERVE_STATIC_MODULE_OPTIONS)
    private readonly ngOptions: ServeStaticModuleOptions[],
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
    private readonly loader: AbstractLoader,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  /**
   * Configure
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(ProtectMiddleware)
      .forRoutes(this.options.swaggerPath || ENTRY_POINT_PROTECT)
  }

  /**
   *
   */
  public static forRoot(options: SwaggerProtectOptions): DynamicModule {
    return {
      module: SwaggerProtect,
      imports: [SwaggerProtectCore.forRoot(options)],
    }
  }

  onModuleInit() {
    const { httpAdapter } = this.httpAdapterHost
    this.loader.register(httpAdapter, this.ngOptions)
  }
}
