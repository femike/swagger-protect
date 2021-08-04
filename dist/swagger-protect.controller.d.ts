import { SwaggerProtectOptions } from '.';
import { SwaggerProtectLogInDto } from './dto/login.dto';
export declare class SwaggerProtectController {
    private readonly options;
    constructor(options: SwaggerProtectOptions);
    entry(): void;
    post(data: SwaggerProtectLogInDto): Promise<{
        token: string;
    }>;
}
