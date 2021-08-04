/// <reference types="node" />
import type { FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { IncomingMessage } from 'http';
import type { Server } from 'http';
declare type Request = FastifyRequest<RouteGenericInterface, Server, IncomingMessage> & {
    cookies: {
        [x: string]: string;
    };
};
export declare function fastifyProtectSwagger(settings: {
    cookieGuard: (token: string) => boolean | Promise<boolean>;
    redirectPath?: string;
    cookieKey?: string;
    entryPath?: string;
}): (req: Request, reply: FastifyReply, next: HookHandlerDoneFunction) => void | FastifyReply;
export default fastifyProtectSwagger;
