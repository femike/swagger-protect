import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { createSwagger } from './swagger'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await createSwagger(app).listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
