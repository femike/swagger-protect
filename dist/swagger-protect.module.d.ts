import type { DynamicModule } from '@nestjs/common';
import type { Options, OptionsAsync } from './types';
import { SwaggerProtectHost } from './swagger-protect-host.module';
export declare class SwaggerProtect extends SwaggerProtectHost {
    static forRoot<Adapter = 'fastify' | 'express'>(options: Options<Adapter>): DynamicModule;
    static forRootAsync<Adapter = 'fastify' | 'express'>(options: OptionsAsync<Adapter>): Promise<DynamicModule>;
}
