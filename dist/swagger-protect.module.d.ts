import { DynamicModule, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SwaggerGuardInterface } from './interfaces';
import type { ExpresssSwaggerProtectOptions, ExpressSwaggerProtectAsyncOptions, SwaggerProtectAsyncOptions, SwaggerProtectOptions } from './types';
declare class SwaggerProtectCore implements OnModuleInit {
    private readonly httpAdapterHost;
    private readonly options;
    private readonly guard;
    constructor(httpAdapterHost: HttpAdapterHost, options: SwaggerProtectOptions, guard: SwaggerGuardInterface);
    onModuleInit(): void;
    static forRoot<A extends 'fastify' | 'express' | unknown>(options: A extends 'fastify' ? SwaggerProtectOptions : A extends 'express' | unknown ? ExpresssSwaggerProtectOptions : never): DynamicModule;
    private static provideUI;
    static forRootAsync<A extends 'fastify' | 'express' | unknown>(options: A extends 'fastify' ? SwaggerProtectAsyncOptions : A extends 'express' | unknown ? ExpressSwaggerProtectAsyncOptions : never): Promise<DynamicModule>;
    private static createProvider;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
export declare class SwaggerProtect extends SwaggerProtectCore {
    static forRoot<A extends 'fastify' | 'express' | unknown>(options: A extends 'fastify' ? SwaggerProtectOptions : A extends 'express' | unknown ? ExpresssSwaggerProtectOptions : never): DynamicModule;
    static forRootAsync<A extends 'fastify' | 'express' | unknown>(options: A extends 'fastify' ? SwaggerProtectAsyncOptions : A extends 'express' | unknown ? ExpressSwaggerProtectAsyncOptions : never): Promise<DynamicModule>;
}
export {};
