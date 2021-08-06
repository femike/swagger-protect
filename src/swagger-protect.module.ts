import { DynamicModule, Global, Inject, Module, Provider } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import {
  ENTRY_POINT_PROTECT,
  fastifyProtectSwagger,
  REDIRECT_TO_LOGIN,
  SWAGGER_COOKIE_TOKEN_KEY,
  SWAGGER_GUARD,
  SWAGGER_LOGIN,
  SWAGGER_PROTECT_OPTIONS,
} from '.'
import { SwaggerGuardInterface } from './interfaces'
import { SwaggerProtectController } from './swagger-protect.controller'
import type {
  ProtectAsyncOptions,
  SwaggerProtectAsyncOptions,
  SwaggerProtectOptions,
} from './types'

const UI_PATH = join(__dirname, '../..', 'swagger-protect-ui/dist')

/**
 * Swagger Protect Core
 */
@Global()
@Module({})
class SwaggerProtectCore {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
    @Inject(SWAGGER_GUARD)
    private readonly guard: SwaggerGuardInterface,
  ) {
    const { httpAdapter } = this.httpAdapterHost
    const server = httpAdapter.getInstance()

    if (Object.keys(server).includes('addHook')) {
      const { logIn, useUI, ...protect } = this.options
      server.addHook(
        'onRequest',
        fastifyProtectSwagger({
          ...protect,
          guard: this.guard || protect.guard,
        }),
      )
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
                rootPath: UI_PATH,
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

  private static provideUI(
    useUI: boolean | undefined,
    loginPath: string | undefined,
  ) {
    if (typeof useUI === 'undefined' && typeof loginPath === 'undefined') {
      return true
    } else if (
      typeof useUI === 'undefined' &&
      typeof loginPath !== 'undefined'
    ) {
      return loginPath === REDIRECT_TO_LOGIN
    } else if (
      typeof useUI !== 'undefined' &&
      typeof loginPath === 'undefined'
    ) {
      return useUI
    } else {
      return useUI && loginPath === REDIRECT_TO_LOGIN
    }
  }

  static async forRootAsync(
    options: SwaggerProtectAsyncOptions,
  ): Promise<DynamicModule> {
    const $options = (await this.createAsyncOptionsProvider(
      options,
    )) as unknown as {
      useFactory: () => ProtectAsyncOptions
    }
    const asyncProviders = await this.createAsyncProviders(options)

    const module = {
      module: SwaggerProtectCore,
      imports: options.imports,
      providers: [...asyncProviders],
    }

    if (typeof options.useFactory !== 'undefined') {
      const { useUI, loginPath, guard, logIn } = $options.useFactory()

      module.providers.push({
        provide: SWAGGER_GUARD,
        useClass: guard,
        inject: SWAGGER_GUARD,
      } as Provider)

      module.providers.push({
        provide: SWAGGER_LOGIN,
        useClass: logIn,
        inject: SWAGGER_LOGIN,
      } as Provider)

      const importStatic = this.provideUI(useUI, loginPath)
        ? [
            ServeStaticModule.forRoot({
              rootPath: UI_PATH,
              renderPath: REDIRECT_TO_LOGIN + '/*',
              serveRoot: REDIRECT_TO_LOGIN,
            }),
          ]
        : []

      return {
        ...module,
        imports: [...(module.imports || []), ...importStatic],
        controllers: this.provideUI(useUI, loginPath)
          ? [SwaggerProtectController]
          : [],
      }
    }

    return module
  }

  private static async createAsyncProviders(
    options: SwaggerProtectAsyncOptions,
  ): Promise<Provider[]> {
    if (options.useFactory) {
      return [await this.createAsyncOptionsProvider(options)]
    }
    return []
  }

  private static async createAsyncOptionsProvider(
    options: SwaggerProtectAsyncOptions,
  ): Promise<Provider> {
    if (typeof options.useFactory !== 'undefined') {
      return {
        provide: SWAGGER_PROTECT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: undefined,
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
 *       // guard callback
 *       guard: (token: string) => !!token,
 *       // OR
 *       guard: new SwaggerGuard(),
 *       // login callback
 *       logIn: async (data: SwaggerProtectLogInDto) => ({ token: '' }),
 *       // OR
 *       logIn: new SwaggerLogin(),
 *       // Options
 *       cookieKey: 'swagger_token',
 *       loginPath: '/login-api',
 *       swaggerPath: '/api/json',
 *       useUI: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 *
 *~@Module({
 *  imports: [
 *     SwaggerProtect.forRootAsync({
 *       imports: [AuthModule],
 *       useFactory: () => ({
 *         guard: SwaggerGuard,
 *         logIn: SwaggerLogin,
 *         cookieKey: 'swagger_token',
 *         loginPath: '/login-api',
 *         swaggerPath: '/api/json',
 *         useUI: true,
 *       })
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: UI_PATH,
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
  public static async forRootAsync(
    options: SwaggerProtectAsyncOptions,
  ): Promise<DynamicModule> {
    return await super.forRootAsync(options)
  }
}
