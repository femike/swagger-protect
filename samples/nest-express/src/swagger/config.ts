import { registerExpressProtectSwagger } from '@femike/swagger-protect'
import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SwaggerGuard } from './guard'

export const SWAGGER_PATH = 'api'

const options = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .addBearerAuth()
  .build()

export function createSwagger(app: INestApplication): INestApplication {
  registerExpressProtectSwagger(app, {
    guard: new SwaggerGuard(),
    swaggerPath: SWAGGER_PATH,
    loginPath: '/login-api',
    cookieKey: 'swagger_token',
  })
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(SWAGGER_PATH, app, document)
  return app
}
