import {
  SwaggerProtect,
  ENTRY_POINT_PROTECT,
  SWAGGER_COOKIE_TOKEN_KEY,
  REDIRECT_TO_LOGIN,
} from '@femike/swagger-protect'
import { INestApplication, HttpServer, ValidationPipe } from '@nestjs/common'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { CatsModule } from '../src/cats/cats.module'
import { fastifyAdapter } from '../src/fastify'
import { createSwagger } from '../src/swagger'
import { v4 as uuid } from 'uuid'
import { useContainer } from 'class-validator'

describe.each([
  {
    cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
    loginPath: REDIRECT_TO_LOGIN,
    swaggerPath: ENTRY_POINT_PROTECT,
  },
])('Default settings (e2e)', settings => {
  let app: INestApplication
  let server: HttpServer
  const token = uuid()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CatsModule, SwaggerProtect],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      fastifyAdapter,
      {
        cors: false,
        logger: ['error'],
      },
    )
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        disableErrorMessages: false,
        enableDebugMessages: true,
      }),
    )
    useContainer(moduleFixture, { fallbackOnErrors: true })
    app.useLogger(['error'])
    app = createSwagger(app)
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
    server = app.getHttpServer()
  })

  afterAll(async () => await app.close())

  it('(GET) /api -', () => {
    return request(server)
      .get('/api')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe('/login-api?backUrl=/api')
      })
  })

  it('(GET) /api/static/index.html -', () => {
    return request(server)
      .get('/api/static/index.html')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '?backUrl=/api/static/index.html',
        )
      })
  })

  it('(GET) /api/json -', () => {
    return request(server)
      .get('/api/json')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '?backUrl=/api/json',
        )
      })
  })

  it('(GET) /api/static/index.html - with Cookie and unregistered token', () => {
    return request(server)
      .get('/api/static/index.html')
      .set({
        Cookie: `${settings.cookieKey}=${uuid()}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          '/login-api?backUrl=/api/static/index.html',
        )
      })
  })

  it('(GET) /api/json - with Cookie and unregistered token', () => {
    return request(server)
      .get('/api/json')
      .set({
        Cookie: `${settings.cookieKey}=${uuid()}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe('/login-api?backUrl=/api/json')
      })
  })

  it('(GET) /api/static/index.html - with Cookie', () => {
    return request(server)
      .get('/api/static/index.html')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          '/login-api?backUrl=/api/static/index.html',
        )
      })
  })

  it('(GET) /api/json - with Cookie', () => {
    return request(server)
      .get('/api/json')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe('/login-api?backUrl=/api/json')
      })
  })

  it('(POST) /login-api - must be disabled', () => {
    return request(server).post(settings.loginPath).expect(404)
  })

  it('(GET) /login-api - must be disabled', () => {
    return request(server).post(settings.loginPath).expect(404)
  })
})
