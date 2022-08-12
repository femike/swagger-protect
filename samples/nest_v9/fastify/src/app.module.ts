import { SwaggerProtect } from '@femike/swagger-protect'
import { Module } from '@nestjs/common'
import { CatsModule } from './cats/cats.module'
import { SwaggerGuard, SwaggerLogin } from './swagger'

@Module({
  imports: [
    CatsModule,
    SwaggerProtect.forRoot<'fastify'>({
      guard: new SwaggerGuard(),
      logIn: new SwaggerLogin(),
      cookieKey: 'swagger_token',
      loginPath: '/login-api',
      swaggerPath: /^\/api(?:\/|\/json|\/swager.+)?$/,
      useUI: true, 
    }),
  ],
})
export class AppModule {}
