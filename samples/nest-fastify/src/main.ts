import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { createSwagger } from './swagger'
import { fastifyAdapter } from './fastify'

import { NestFastifyApplication } from '@nestjs/platform-fastify'
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  )
  await createSwagger(app).listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
