import type { SwaggerGuardInterface } from '@femike/swagger-protect'

/**
 *
 */
export class SwaggerGuard implements SwaggerGuardInterface {
  /**
   * Method guard
   */
  async canActivate(token: string): Promise<boolean> {
    return !!token
  }
}
