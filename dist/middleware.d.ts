import type { INestApplication } from '@nestjs/common';
import type { Express } from 'express';
import type { onRequestHookHandler } from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';
import type { ExpressHookSettings, SettingsHook } from './types';
export declare type Cookies = {
    cookies: {
        [x: string]: string;
    };
};
declare type OnHookRequestReq = Parameters<onRequestHookHandler>['0'];
declare type OnHookRequestReply = Parameters<onRequestHookHandler>['1'];
declare type OnHookRequestDone = Parameters<onRequestHookHandler>['2'];
declare function middleware<Req extends OnHookRequestReq, Res extends OnHookRequestReply>(settings: SettingsHook): (req: Req, reply: Res, next: OnHookRequestDone) => void | RouteGenericInterface;
export declare const fastifyProtectSwagger: typeof middleware;
export declare const registerExpressProtectSwagger: (app: INestApplication, settings: ExpressHookSettings) => void;
export declare const expressProtectSwagger: (app: Express, settings: ExpressHookSettings) => void;
export {};
