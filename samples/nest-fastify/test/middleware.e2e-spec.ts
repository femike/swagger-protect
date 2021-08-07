import { SwaggerProtect } from '@femike/swagger-protect'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { CatsModule } from '../src/cats/cats.module'
import { fastifyAdapter } from '../src/fastify'
import { createSwagger, SWAGGER_PATH } from '../src/swagger'
import { SwaggerGuardMock } from './mocks/guard'

describe('Middleware (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CatsModule,
        SwaggerProtect.forRoot({
          guard: new SwaggerGuardMock(),
          logIn: async () => ({ token: '' }),
          cookieKey: 'swagger_token',
          loginPath: '/login-api',
          swaggerPath: '/' + SWAGGER_PATH + '/*',
          useUI: true,
        }),
      ],
    }).compile()

    app = await NestFactory.create<NestFastifyApplication>(
      moduleFixture,
      fastifyAdapter,
      {
        cors: false,
        logger: ['error'],
      },
    )
    app.useLogger(['error'])
    await createSwagger(app).init()
    await app.getHttpAdapter().getInstance().ready()
  })

  it('/ (GET)', () => {
    const server = app.getHttpServer()
    debugger
    return request(server).get('/').expect(200).expect('Hello World!')
  })
})
