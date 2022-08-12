import { HttpAdapterHost } from '@nestjs/core';
import type { InjectionToken, OnModuleInit, Provider, Type } from '@nestjs/common';
import type { SwaggerGuardInterface } from './interfaces';
import type { SwaggerProtectOptions } from './types';
export declare class SwaggerProtectHost implements OnModuleInit {
    private readonly adapterHost;
    private readonly options;
    private readonly guard;
    constructor(adapterHost: HttpAdapterHost, options: SwaggerProtectOptions, guard: SwaggerGuardInterface);
    onModuleInit(): void;
    protected static createProvider<Obj, Interface>(ob: Obj, symbol: InjectionToken, asClass: Type<Interface>): Provider;
    protected static provideUI(useUI?: boolean, loginPath?: string): boolean;
}
