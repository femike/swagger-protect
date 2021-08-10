/// <reference types="node" />
import { INestApplication } from '@nestjs/common';
import type { Express } from 'express';
import type { FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { IncomingMessage, Server } from 'http';
import type { ExpressHookSettings, SettingsHook } from './types';
declare type FastiRequest = FastifyRequest<RouteGenericInterface, Server, IncomingMessage> & {
    cookies: {
        [x: string]: string;
    };
};
declare function middleware<Req extends FastiRequest, Res extends FastifyReply>(settings: SettingsHook): (req: Req, reply: Res, next: HookHandlerDoneFunction) => void | RouteGenericInterface;
export declare const fastifyProtectSwagger: typeof middleware;
export declare const registerExpressProtectSwagger: (app: INestApplication, settings: ExpressHookSettings) => void;
export declare const expressProtectSwagger: (app: Express, settings: ExpressHookSettings) => void;
export { };
