import type { SwaggerLoginInterface } from '@femike/swagger-protect'

export class SwaggerLoginMock implements SwaggerLoginInterface {
  execute = jest.fn()
}
