import { Module } from '@nestjs/common'
import { CatsModule } from './cats/cats.module'
import { SwaggerProtect } from '@femike/swagger-protect'
import { SwaggerGuard, SwaggerLogin } from './swagger'

@Module({
  imports: [
    CatsModule,
    SwaggerProtect.forRoot({
      guard: new SwaggerGuard(),
      logIn: new SwaggerLogin(),
      cookieKey: 'swagger_token',
      loginPath: '/login-api',
      swaggerPath: /^\/api\/(json|static\/index.html)(?:\/)?$/,
      // swaggerPath: '/' + SWAGGER_PATH + '/(.*)',
      useUI: true,
    }),
  ],
})
export class AppModule {}
