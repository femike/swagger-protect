/// <reference types="node" />
import type { FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { IncomingMessage } from 'http';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import type { Server } from 'http';
import type { SwaggerGuard } from './types';
declare type FastiRequest = FastifyRequest<RouteGenericInterface, Server, IncomingMessage> & {
    cookies: {
        [x: string]: string;
    };
};
declare function middleware<Req extends FastiRequest | ExpressRequest, Res extends ExpressResponse | FastifyReply>(settings: {
    guard: SwaggerGuard;
    loginPath?: string;
    cookieKey?: string;
    swaggerPath?: string;
}): (req: Req, reply: Res, next: HookHandlerDoneFunction) => void | Res;
export declare const fastifyProtectSwagger: typeof middleware;
export declare const expressProtectSwagger: typeof middleware;
export {};
