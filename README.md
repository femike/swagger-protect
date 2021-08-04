## Swagger Protect Module

- Swagger protect Fastify hook
- Swagger protect Nestjs module

### Swagger protect Fastify hook

Easy way to protect swagger with fastify use a hook.

```typescript
import { fastifyProtectSwagger } from '@femike/swagger-protect'
import { getConnection } from 'typeorm'
import { TokenEntity } from 'your-application/src/entities'

// With clean fastify application
fastify.addHook(
  'onRequest',
  fastifyProtectSwagger({
    cookieGuard: (
      token, // must return boolean result (token: string) => Promise<boolean> for example typeorm find token on fail return false
    ) =>
      getConnection()
        .getRepository(TokenEntity)
        .findOneOrFail(token)
        .then(t => t.token === token),
    cookieKey: 'swagger_token', // key must be stored in cookies on login
    entryPath: '/api', // entry point will be protect with guard above
    redirectPath: '/login-api', // redirect on fail guard
  }),
)

// For NestJS With Fastify Adapter
fastifyAdapter.getInstance().addHook(
  'onRequest',
  fastifyProtectSwagger({
    cookieGuard: token =>
      getConnection()
        .getRepository(TokenEntity)
        .findOneOrFail(token)
        .then(t => t.token === token),
    cookieKey: 'swagger_token',
    entryPath: '/api',
    redirectPath: '/login-api',
  }),
)
```

When guard return `true`, hook go to the next way and show swagger open api page.

If guard return `false`, user will be redirect to the page /login-api

Your must create frontend application with sign-in form and set cookie with `key` setted above on succesfuly login

### Swagger protect NestJS Module

```typescript
import { LoggerModule } from '@femike/logger'
import { Module } from '@nestjs/common'
import { SwaggerProtect } from '@femike/swagger-protect'

@Module({
  imports: [
    LoggerModule
    DatabaseOrmModuleAsync,
    SwaggerProtect.forRoot({

    }),
  ],
  controllers: [AppController],
  providers: [HttpStrategy, AppService, AppLogger],
})
export class AppModule {}

```
