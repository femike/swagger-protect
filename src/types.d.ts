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
 * Options Factory
 */
export interface SwaggerProtectOptionsFactory {
  create(name?: string): Promise<SwaggerProtectOptions> | SwaggerProtectOptions
}

/**
 * Async Options
 */
export interface SwaggerProtectAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useExisting?: Type<SwaggerProtectOptionsFactory>
  useClass?: Type<SwaggerProtectOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<SwaggerProtectOptions> | SwaggerProtectOptions
  inject?: any[]
}
