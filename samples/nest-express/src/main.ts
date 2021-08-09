import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { createSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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
