import { SwaggerProtect } from '@femike/swagger-protect'
import { Module } from '@nestjs/common'
import { CatsModule } from './cats/cats.module'
import { SwaggerLogin } from './swagger'

@Module({
  imports: [
    CatsModule,
    SwaggerProtect.forRoot({
      guard: () => false, // guard required but no effect on express
      logIn: new SwaggerLogin(),
      swaggerPath: 'api', // no effect on express
      loginPath: '/login-api', // no effect on express
      cookieKey: 'swagger_token', // no effect on express
    }),
  ],
})
export class AppModule {}
