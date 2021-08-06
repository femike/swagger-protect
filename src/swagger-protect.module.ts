import { DynamicModule, Global, Inject, Module } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import {
  ENTRY_POINT_PROTECT,
  fastifyProtectSwagger,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import { SwaggerProtectController } from './swagger-protect.controller'
import type { SwaggerProtectOptions } from './types'

/**
 * Swagger Protect Core
 */
@Global()
@Module({})
class SwaggerProtectCore {
  constructor(
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {
    const { httpAdapter } = this.httpAdapterHost
    const server = httpAdapter.getInstance()

    if (Object.keys(server).includes('addHook')) {
      const { logIn, useUI, ...protect } = this.options
      server.addHook('onRequest', fastifyProtectSwagger(protect))
    }
  }

  static forRoot(options: SwaggerProtectOptions): DynamicModule {
    const moduleOptions = {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: {
        cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
        loginPath: REDIRECT_TO_LOGIN,
        swaggerPath: ENTRY_POINT_PROTECT,
        useUI: true,
        ...options,
      },
    }

    if (options.loginPath?.includes('*'))
      throw new Error('`loginPath` must not contain (*) wildcards.')

    return {
      module: SwaggerProtectCore,
      imports:
        moduleOptions.useValue.useUI &&
        moduleOptions.useValue.loginPath === REDIRECT_TO_LOGIN
          ? [
              ServeStaticModule.forRoot({
                rootPath: join(__dirname, '..', 'ui/dist'),
                renderPath: REDIRECT_TO_LOGIN + '/*',
                serveRoot: REDIRECT_TO_LOGIN,
              }),
            ]
          : [],
      providers: [moduleOptions],
      exports: [moduleOptions],
      controllers:
        moduleOptions.useValue.useUI &&
        moduleOptions.useValue.loginPath === REDIRECT_TO_LOGIN
          ? [SwaggerProtectController]
          : [],
    }
  }
}

/**
 * Swagger Protect Module
 * @example
 * ```typescript
 *~@Module({
 *  imports: [
 *     SwaggerProtect.forRoot({
 *       guard: new SwaggerGuard(),
 *       // OR
 *       guard: (token: string) => !!token,
 *       // login callback
 *       logIn: new SwaggerLogin(),
 *       // OR
 *       logIn: async (data: SwaggerProtectLogInDto) => ({ token: '' }),
 *       // Options
 *       cookieKey: 'swagger_token',
 *       loginPath: '/login-api',
 *       swaggerPath: '/api/json',
 *       useUI: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
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
      },
    },
  ],
  controllers: [SwaggerProtectController],
})
export class SwaggerProtect extends SwaggerProtectCore {
  public static forRoot(options: SwaggerProtectOptions): DynamicModule {
    return super.forRoot(options)
  }
}
