import * as swaggerUI from 'swagger-ui-express'
import type { Application } from 'express'
import swaggerDocument from './doc.json'

export const SWAGGER_PATH = 'api'

export function createSwagger(app: Application): Application {
  app.use('/' + SWAGGER_PATH, swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  return app
}
