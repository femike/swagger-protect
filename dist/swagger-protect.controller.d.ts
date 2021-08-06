import type { Response } from 'express';
import { SwaggerProtectLogInDto } from './dto/login.dto';
import { SwaggerLoginInterface } from './interfaces';
import type { SwaggerProtectOptions } from './types';
export declare class SwaggerProtectController {
    private readonly options;
    private readonly logIn;
    constructor(options: SwaggerProtectOptions, logIn: SwaggerLoginInterface);
    entry(res: Response, backUrl: string): void;
    post(data: SwaggerProtectLogInDto): Promise<{
        token: string;
    }> | undefined;
}
