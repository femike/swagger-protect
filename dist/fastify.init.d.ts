import type { FastifyInstance } from 'fastify';
import type { SwaggerGuardInterface } from './interfaces';
import type { SwaggerProtectOptions } from './types';
export declare function fastifyOnModuleInit(server: FastifyInstance, options: SwaggerProtectOptions, guard: SwaggerGuardInterface): Promise<void>;
export default fastifyOnModuleInit;
