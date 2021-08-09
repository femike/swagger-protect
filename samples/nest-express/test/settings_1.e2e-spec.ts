import { SwaggerProtect } from '@femike/swagger-protect'
import { INestApplication, HttpServer, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { CatsModule } from '../src/cats/cats.module'
import { createSwagger } from './swagger'
import { SwaggerGuardMock } from './mocks/guard'
import { SwaggerLoginMock } from './mocks/login'
import { v4 as uuid } from 'uuid'
import { useContainer } from 'class-validator'

describe.each([
  {
    cookieKey: 'swagger_token',
    loginPath: '/login-api',
  },
])('forRoot() Default (e2e)', settings => {
  let app: INestApplication
  let server: HttpServer
  const token = uuid()

  const guardMock = new SwaggerGuardMock()
  const loginMock = new SwaggerLoginMock()

  const user = {
    login: 'swagger_user',
    password: uuid(),
  }

  jest
    .spyOn(guardMock, 'canActivate')
    .mockImplementation(async (_token: string) => _token === token)

  jest
    .spyOn(loginMock, 'execute')
    .mockImplementation(async ({ login, password }) => {
      if (login === user.login && password === user.password) return { token }
      else return { token: '' }
    })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CatsModule,
        SwaggerProtect.forRoot({
          logIn: loginMock,
        }),
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        disableErrorMessages: false,
        enableDebugMessages: true,
      }),
    )
    useContainer(moduleFixture, { fallbackOnErrors: true })
    app.useLogger(['error'])
    app = createSwagger(app, {
      guard: guardMock,
    })
    await app.init()
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

  it('(GET) /api/ -', () => {
    return request(server)
      .get('/api/')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(settings.loginPath + '?backUrl=/api/')
      })
  })

  it('(GET) /api-json -', () => {
    return request(server)
      .get('/api-json')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '?backUrl=/api-json',
        )
      })
  })

  it('(GET) /api/ - with Cookie and unregistered token', () => {
    return request(server)
      .get('/api/')
      .set({
        Cookie: `${settings.cookieKey}=${uuid()}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe('/login-api?backUrl=/api/')
      })
  })

  it('(GET) /api-json - with Cookie and unregistered token', () => {
    return request(server)
      .get('/api-json')
      .set({
        Cookie: `${settings.cookieKey}=${uuid()}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe('/login-api?backUrl=/api-json')
      })
  })

  it('(GET) /api/ - with Cookie', () => {
    return request(server)
      .get('/api/')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(200)
      .then(res => {
        expect(res.text).toContain('<div id="swagger-ui"></div>')
      })
  })

  it('(GET) /api-json - with Cookie', () => {
    return request(server)
      .get('/api-json')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(200)
      .then(res => {
        expect(res.text).toContain('"openapi":"3.0.0"')
      })
  })

  it('(POST) /login-api - with empty', () => {
    return request(server)
      .post(settings.loginPath)
      .set({
        // Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(400)
      .then(res => {
        expect(res.body.message).toEqual([
          'login should not be empty',
          'password should not be empty',
        ])
      })
  })

  it('(POST) /login-api - empty pass data', () => {
    return request(server)
      .post(settings.loginPath)
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        login: '',
        password: '',
      })
      .expect(400)
      .then(res => {
        expect(res.body.message).toEqual([
          'login should not be empty',
          'password should not be empty',
        ])
      })
  })

  it('(POST) /login-api - empty password', () => {
    return request(server)
      .post(settings.loginPath)
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        login: 'wrong',
        password: '',
      })
      .expect(400)
      .then(res => {
        expect(res.body.message).toEqual(['password should not be empty'])
      })
  })

  it('(POST) /login-api - empty login', () => {
    return request(server)
      .post(settings.loginPath)
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        login: '',
        password: 'wrong',
      })
      .expect(400)
      .then(res => {
        expect(res.body.message).toEqual(['login should not be empty'])
      })
  })

  it('(POST) /login-api - wrong pass data', () => {
    return request(server)
      .post(settings.loginPath)
      .set({
        'Content-Type': 'application/json',
      })
      .send({
        login: 'wrong',
        password: 'wrong',
      })
      .expect(403)
      .then(res => {
        expect(res.body.message).toEqual('Forbidden')
      })
  })

  it('(POST) /login-api - right data', () => {
    return request(server)
      .post(settings.loginPath)
      .set({
        'Content-Type': 'application/json',
      })
      .send(user)
      .expect(201)
      .then(res => {
        // console.debug([res.body, res.header, res.text])
        expect(res.body).toEqual({ token })
      })
  })
})
