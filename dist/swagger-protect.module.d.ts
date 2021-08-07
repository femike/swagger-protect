import { DynamicModule, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SwaggerGuardInterface } from './interfaces';
import type { SwaggerProtectAsyncOptions, SwaggerProtectOptions } from './types';
declare class SwaggerProtectCore implements OnModuleInit {
    private readonly httpAdapterHost;
    private readonly options;
    private readonly guard;
    constructor(httpAdapterHost: HttpAdapterHost, options: SwaggerProtectOptions, guard: SwaggerGuardInterface);
    onModuleInit(): void;
    static forRoot(options: SwaggerProtectOptions): DynamicModule;
    private static provideUI;
    static forRootAsync(options: SwaggerProtectAsyncOptions): Promise<DynamicModule>;
    private static createProvider;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
export declare class SwaggerProtect extends SwaggerProtectCore {
    static forRoot(options: SwaggerProtectOptions): DynamicModule;
    static forRootAsync(options: SwaggerProtectAsyncOptions): Promise<DynamicModule>;
}
export {};
