import type { DynamicModule } from '@nestjs/common';
import type { OptionsAsync } from './types';
import { SwaggerProtectHost } from './swagger-protect-host.module';
export declare class SwaggerProtectHostAsyncModule extends SwaggerProtectHost {
    static forRootAsync<Adapter extends 'fastify' | 'express'>(options: OptionsAsync<Adapter>): Promise<DynamicModule>;
    private static createAsyncOptionsProvider;
}
