import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const SWAGGER_PATH = 'api'

const options = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .addBearerAuth()
  .build()

export function createSwagger(app: INestApplication): INestApplication {
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(SWAGGER_PATH, app, document)
  return app
}
