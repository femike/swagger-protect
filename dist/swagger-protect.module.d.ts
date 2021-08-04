import { DynamicModule, MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AbstractLoader, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { SwaggerProtectLogInDto } from './dto/login.dto';
export declare type SwaggerGuard = (token: string) => boolean | Promise<boolean>;
export interface SwaggerProtectOptions {
    guard: SwaggerGuard;
    swaggerPath?: string;
    loginPath?: string;
    cookieKey?: string;
    useUI?: boolean;
    logIn?: (data: SwaggerProtectLogInDto) => Promise<{
        token: string;
    }>;
}
export declare class SwaggerProtectCore {
    static forRoot(options?: SwaggerProtectOptions): DynamicModule;
}
export declare class SwaggerProtect implements NestModule, OnModuleInit {
    private readonly ngOptions;
    private readonly options;
    private readonly loader;
    private readonly httpAdapterHost;
    constructor(ngOptions: ServeStaticModuleOptions[], options: SwaggerProtectOptions, loader: AbstractLoader, httpAdapterHost: HttpAdapterHost);
    configure(consumer: MiddlewareConsumer): void;
    static forRoot(options: SwaggerProtectOptions): DynamicModule;
    onModuleInit(): void;
}
