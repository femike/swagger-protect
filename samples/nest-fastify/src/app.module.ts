import { Module } from '@nestjs/common'
import { CatsModule } from './cats/cats.module'
import { SwaggerProtect } from '@femike/swagger-protect'
import { SwaggerGuard, SWAGGER_PATH } from './swagger'

@Module({
  imports: [
    CatsModule,
    SwaggerProtect.forRoot({
      guard: new SwaggerGuard(),
      logIn: async () => ({ token: '' }),
      cookieKey: 'swagger_token',
      loginPath: '/login-api',
      swaggerPath: '/' + SWAGGER_PATH + '/*',
      useUI: true,
    }),
  ],
})
export class AppModule {}
