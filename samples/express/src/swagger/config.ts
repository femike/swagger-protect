import * as swaggerUI from 'swagger-ui-express'
import type { Express } from 'express'
import swaggerDocument from './doc.json'
import { expressProtectSwagger } from '@femike/swagger-protect'

export const SWAGGER_PATH = 'api'

export function createSwagger(app: Express): Express {
  expressProtectSwagger(app, {
    guard: (token: string) => !!token, // if token exists access granted!
  })
  app.use('/' + SWAGGER_PATH, swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  return app
}
