import {
  SwaggerProtectLogInDto,
  SwaggerLoginInterface,
} from '@femike/swagger-protect'

/**
 * Swagger Login
 */
export class SwaggerLogin implements SwaggerLoginInterface {
  async execute({
    login,
    password,
  }: SwaggerProtectLogInDto): Promise<{ token: string }> {
    return { token: '' }
  }
}
