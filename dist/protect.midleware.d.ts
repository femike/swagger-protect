import { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SwaggerProtectOptions } from '.';
export declare class ProtectMiddleware implements NestMiddleware {
    private readonly options;
    constructor(options: SwaggerProtectOptions);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
