import type { ModuleMetadata, Type } from '@nestjs/common';
import type { SwaggerProtectLogInDto } from './dto/login.dto';
import type { SwaggerGuardInterface, SwaggerLoginInterface } from './interfaces';
export declare type SwaggerGuard = SwaggerGuardInterface | ((token: string) => boolean | Promise<boolean>);
export declare type SwagerLoginType = (data: SwaggerProtectLogInDto) => Promise<{
    token: string;
}>;
export declare type SwaggerLogin = SwaggerLoginInterface | SwagerLoginType;
export interface SwaggerProtectOptions {
    guard: SwaggerGuard;
    logIn: SwaggerLogin;
    swaggerPath?: string | RegExp;
    loginPath?: string;
    cookieKey?: string;
    useUI?: boolean;
}
export interface ExpresssSwaggerProtectOptions {
    guard?: never;
    logIn: SwaggerLogin;
    swaggerPath?: string;
    loginPath?: string;
    cookieKey?: string;
    useUI?: boolean;
}
export interface SettingsHook extends Omit<SwaggerProtectOptions, 'logIn' | 'useUI' | 'swaggerPath'> {
    swaggerPath: string | RegExp;
    loginPath: string;
    cookieKey: string;
}
export declare type ExpressHookSettings = Omit<SwaggerProtectOptions, 'logIn' | 'useUI' | 'swaggerPath'> & {
    swaggerPath?: string;
};
export declare type ProtectOptionsAsync = Omit<SwaggerProtectOptions, 'guard' | 'logIn'> & {
    guard: SwaggerGuard | Type<SwaggerGuardInterface>;
    logIn: SwaggerLogin | Type<SwaggerLoginInterface>;
};
export declare type ExpressProtectOptionsAsync = Omit<ExpresssSwaggerProtectOptions, 'logIn'> & {
    logIn: SwaggerLogin | Type<SwaggerLoginInterface>;
};
export interface SwaggerProtectOptionsFactory {
    readonly guard: SwaggerGuardInterface;
    readonly logIn: SwaggerLoginInterface;
    options(name?: string): Promise<Partial<ProtectOptionsAsync>> | Partial<ProtectOptionsAsync>;
}
export interface SwaggerProtectOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: (...args: any[]) => Promise<ProtectOptionsAsync> | ProtectOptionsAsync;
    inject?: any[];
}
export interface ExpressSwaggerProtectOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: (...args: any[]) => Promise<ExpressProtectOptionsAsync> | ExpressProtectOptionsAsync;
    inject?: any[];
}
export declare type Options<A> = A extends 'fastify' ? SwaggerProtectOptions : A extends 'express' ? ExpresssSwaggerProtectOptions : never;
export declare type OptionsAsync<A> = A extends 'fastify' ? SwaggerProtectOptionsAsync : A extends 'express' ? ExpressSwaggerProtectOptionsAsync : never;
declare module 'fastify' {
    interface FastifyRequest {
        cookies: Record<string, unknown>;
    }
}
