import { Module } from '@nestjs/common'
import { SwaggerProtect } from '@femike/swagger-protect'
//
import { SwaggerGuard, SwaggerLogin } from './swagger'
import { CatsModule } from './cats/cats.module'

@Module({
  imports: [
    CatsModule,
    SwaggerProtect.forRoot<'fastify'>({
      guard: new SwaggerGuard(),
      logIn: new SwaggerLogin(),
      cookieKey: 'swagger_token',
      loginPath: '/login-api',
      swaggerPath: /^\/api\/(json|static\/index.html)(?:\/)?$/,
      useUI: true,
    }),
  ],
})
export class AppModule {}
