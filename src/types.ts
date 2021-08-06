import type { ModuleMetadata, Type } from '@nestjs/common'
import type { SwaggerProtectLogInDto } from './dto/login.dto'
import type { SwaggerGuardInterface, SwaggerLoginInterface } from './interfaces'

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

export type ProtectAsyncOptions = Omit<
  SwaggerProtectOptions,
  'guard' | 'logIn'
> & {
  guard: SwaggerGuard | Type<SwaggerGuardInterface>
  logIn: SwaggerLogin | Type<SwaggerLoginInterface>
}

/**
 * Options Factory
 */
export interface SwaggerProtectOptionsFactory {
  readonly guard: SwaggerGuardInterface
  readonly logIn: SwaggerLoginInterface
  options(
    name?: string,
  ): Promise<Partial<ProtectAsyncOptions>> | Partial<ProtectAsyncOptions>
}

/**
 * Async Options
 */
export interface SwaggerProtectAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string
  useFactory?: (
    ...args: any[]
  ) => Promise<ProtectAsyncOptions> | ProtectAsyncOptions
  inject?: any[]
}
