import * as swaggerUI from 'swagger-ui-express'
import type { Express } from 'express'
import swaggerDocument from '../src/swagger/doc.json'
import { expressProtectSwagger } from '@femike/swagger-protect/dist/middleware'
import type { ExpressHookSettings } from '@femike/swagger-protect/dist/types'

export const SWAGGER_PATH = 'api'

export function createSwagger(
  app: Express,
  settings: ExpressHookSettings,
): Express {
  expressProtectSwagger(app, settings)
  app.use('/' + SWAGGER_PATH, swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  return app
}
