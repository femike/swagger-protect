import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
//
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
//
import { AppModule } from './app.module'
import { fastifyAdapter } from './fastify'
import { createSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  )
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false,
      enableDebugMessages: true,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await createSwagger(app).listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
