<p align="center">
  <a href="https://www.npmjs.com/package/@femike/swagger-protect" target="blank"><img src="images/logo.svg" width="120" alt="Swagger Protect Logo" /></a>
</p>
<p align="center">
<a href="https://www.npmjs.com/org/femike"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/org/femike"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/org/femike"><img src="https://img.shields.io/npm/dm/@femike/swagger-protect.svg" alt="NPM Downloads" /></a>
<!-- <a href="#"><img src="https://img.shields.io/badge/donate-PayPal-ff3f59.svg" alt="Donate PayPal" /></a> -->
<a href="https://yoomoney.ru/to/41001486944398/250"><img src="https://img.shields.io/badge/donate-%D0%AEMoney-blueviolet.svg" alt="Donate ЮMoney" /></a>
</p>

## Installation

```bash
$ npm install @femike/swagger-protect

# OR

$ yarn add @femike/swagger-protect
```

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

If guard return `false`, user will be redirected to the page /login-api

Your must create frontend application with sign-in form and set cookie with `swagger_token` key setted above on succesfuly login or use `@femike/swager-protect-ui`

### Swagger protect NestJS Module

```typescript
// $ touch ./src/guards/swagger.guard.ts

import type { SwaggerGuardInterface } from '@femike/swagger-protect'

class SwaggerGuard implements SwaggerGuardInterface {
  constructor(
    @Inject(YourProtectService) private readonly service: YourProtectService,
  ) {}

  /**
   * Method guard
   */
  async canActivate(token: string): Promise<boolean> {
    return await this.service.method(token)
  }
}
```

```typescript
// ./src/app.module.ts

import { LoggerModule } from '@femike/logger'
import { Module } from '@nestjs/common'
import { SwaggerProtect } from '@femike/swagger-protect'

@Module({
  imports: [
    LoggerModule
    DatabaseOrmModuleAsync,
    SwaggerProtect.forRoot({
      guard: new SwaggerGuard() // or you can use a callback (token: string) => Promise<boolean>
    }),
  ],
  controllers: [AppController],
  providers: [HttpStrategy, AppService, AppLogger],
})
export class AppModule {}

```

## API Spec

The `forRoot()` method takes an options object with a few useful properties.

| Property       | Type             | Description                                                                                                                                     |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `guard`        | Function / Class | Function or Class guard must be return boolean result. Class meight be implement `SwaggerGuardInterface`. Default: `(token: string) => !!token` |
| `swaggerPath?` | string           | Path where answered swagger ui. Default: `/api`                                                                                                 |
| `loginPath?`   | string           | Path where user will be redirect on fail guard. Default `/login-api`                                                                            |
| `cookieKey?`   | string           | Key name stored in Cookie. Default `swagger_token`                                                                                              |
| `useUI?`       | Boolean          | Use or not user interface for login to swagger ui. When loginPath was changed from `/login-api` ui will be disabled. Default `true`             |

## Example

See full example [here](https://femike.github.com/swagger-protect/tree/main/samples).
