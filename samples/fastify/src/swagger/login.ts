import {
  SwaggerProtectLogInDto,
  SwaggerLoginInterface,
} from '@femike/swagger-protect'
import { v4 as uuid } from 'uuid'

/**
 * Swagger Login
 */
export class SwaggerLogin implements SwaggerLoginInterface {
  async execute({
    login,
    password,
  }: SwaggerProtectLogInDto): Promise<{ token: string }> {
    return login === 'admin' && password === 'changeme'
      ? { token: uuid() }
      : { token: '' }
  }
}
