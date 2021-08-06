import { SwaggerProtectLogInDto } from '../dto/login.dto';
export interface SwaggerLoginInterface {
    execute(data: SwaggerProtectLogInDto): Promise<{
        token: string;
    }>;
}
