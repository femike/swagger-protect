import type { SwaggerGuardInterface } from '@femike/swagger-protect'

export class SwaggerGuardMock implements SwaggerGuardInterface {
  canActivate = jest.fn()
}

export const guardCallbackMock = jest.fn()
