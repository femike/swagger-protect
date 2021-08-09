import type { ModuleMetadata, Type } from '@nestjs/common';
import type { SwaggerProtectLogInDto } from './dto/login.dto';
import type { SwaggerGuardInterface, SwaggerLoginInterface } from './interfaces';
export declare type SwaggerGuard = SwaggerGuardInterface | ((token: string) => boolean | Promise<boolean>);
export declare type SwaggerLogin = SwaggerLoginInterface | ((data: SwaggerProtectLogInDto) => Promise<{
    token: string;
}>);
export interface SwaggerProtectOptions {
    guard: SwaggerGuard;
    logIn: SwaggerLogin;
    swaggerPath?: string | RegExp;
    loginPath?: string;
    cookieKey?: string;
    useUI?: boolean;
}
export interface ExpresssSwaggerProtectOptions {
    guard?: () => void;
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
export declare type ProtectAsyncOptions = Omit<SwaggerProtectOptions, 'guard' | 'logIn'> & {
    guard: SwaggerGuard | Type<SwaggerGuardInterface>;
    logIn: SwaggerLogin | Type<SwaggerLoginInterface>;
};
export declare type ExpressProtectAsyncOptions = Omit<ExpresssSwaggerProtectOptions, 'logIn'> & {
    logIn: SwaggerLogin | Type<SwaggerLoginInterface>;
};
export interface SwaggerProtectOptionsFactory {
    readonly guard: SwaggerGuardInterface;
    readonly logIn: SwaggerLoginInterface;
    options(name?: string): Promise<Partial<ProtectAsyncOptions>> | Partial<ProtectAsyncOptions>;
}
export interface SwaggerProtectAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: (...args: any[]) => Promise<ProtectAsyncOptions> | ProtectAsyncOptions;
    inject?: any[];
}
export interface ExpressSwaggerProtectAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useFactory?: (...args: any[]) => Promise<ExpressProtectAsyncOptions> | ExpressProtectAsyncOptions;
    inject?: any[];
}
