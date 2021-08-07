import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleInit,
  Provider,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as cookieParser from 'cookie-parser'
import { join } from 'path'
import {
  ENTRY_POINT_PROTECT,
  expressProtectSwagger,
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

const isClass = (ob: any) => /^\s*?class/.test(ob.toString())

/**
 * Swagger Protect Core
 */
@Global()
@Module({})
class SwaggerProtectCore implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(SWAGGER_PROTECT_OPTIONS)
    private readonly options: SwaggerProtectOptions,
    @Inject(SWAGGER_GUARD)
    private readonly guard: SwaggerGuardInterface,
  ) {}

  onModuleInit() {
    const { httpAdapter } = this.httpAdapterHost
    const server = httpAdapter.getInstance()

    if (Object.keys(server).includes('addHook')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { logIn, useUI, ...protect } = this.options
      server.addHook(
        'onRequest',
        fastifyProtectSwagger({
          ...protect,
          guard: this.guard || protect.guard,
        }),
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { logIn, useUI, ...protect } = this.options
      server.use(cookieParser())
      server.use(
        expressProtectSwagger({
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

    // @todo more expansive check
    if (options.loginPath?.includes('*'))
      throw new Error('`loginPath` must not contain (*) wildcards.')

    const swaggerLoginProvide: Provider =
      typeof options.logIn === 'function'
        ? {
            provide: SWAGGER_LOGIN,
            useClass: class SwaggerLogin {
              constructor(readonly execute = options.logIn) {}
            },
            inject: [SWAGGER_LOGIN],
          }
        : {
            provide: SWAGGER_LOGIN,
            useValue: options.logIn,
            inject: [SWAGGER_LOGIN],
          }

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
      providers: [
        moduleOptions,
        {
          provide: SWAGGER_GUARD,
          useValue: options.guard,
          inject: [SWAGGER_GUARD],
        },
        swaggerLoginProvide,
      ],
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

      module.providers.push(
        this.createProvider(
          guard,
          SWAGGER_GUARD,
          class SwaggerGuard {
            constructor(readonly canActivate = guard) {}
          },
        ),
      )

      module.providers.push(
        this.createProvider(
          logIn,
          SWAGGER_LOGIN,
          class SwaggerLogin {
            constructor(readonly execute = logIn) {}
          },
        ),
      )
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

  private static createProvider(
    ob: any,
    symbol: string,
    asClass: any,
  ): Provider {
    if (typeof ob === 'function') {
      if (isClass(ob)) {
        return {
          provide: symbol,
          useClass: ob,
          inject: [symbol],
        }
      } else {
        return {
          provide: symbol,
          useClass: asClass,
          inject: [symbol],
        }
      }
    } else if (typeof ob === 'object') {
      return {
        provide: symbol,
        useValue: ob,
        inject: [symbol],
      } as Provider
    }

    return {} as Provider
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
  providers: [
    {
      provide: SWAGGER_PROTECT_OPTIONS,
      useValue: {
        cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
        loginPath: REDIRECT_TO_LOGIN,
        swaggerPath: ENTRY_POINT_PROTECT,
        useUI: false,
      },
    },
    {
      provide: SWAGGER_GUARD,
      useClass: class SwaggerGuard {
        async canActivate() {
          return false
        }
      },
    },
  ],
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
