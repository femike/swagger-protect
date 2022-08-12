import { DynamicModule } from '@nestjs/common';
import type { Options } from './types';
import { SwaggerProtectHost } from './swagger-protect-host.module';
export declare class SwaggerProtectHostModule extends SwaggerProtectHost {
    static forRoot<Adapter extends 'fastify' | 'express'>(options: Options<Adapter>): DynamicModule;
}
