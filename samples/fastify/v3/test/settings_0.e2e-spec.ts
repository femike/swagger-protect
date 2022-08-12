import { v4 as uuid } from 'uuid'
import request from 'supertest'
import {
  ENTRY_POINT_PROTECT,
  SWAGGER_COOKIE_TOKEN_KEY,
  REDIRECT_TO_LOGIN,
} from '@femike/swagger-protect/dist/constatnt'
//
import type { Server } from 'node:http'
//
import bootstrap, { FastifyApp } from './bootstrap'
import { SwaggerLoginMock } from './mocks/login'
import { SwaggerGuardMock } from './mocks/guard'

describe.each([
  {
    cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
    loginPath: REDIRECT_TO_LOGIN,
    swaggerPath: ENTRY_POINT_PROTECT,
  },
])('Default settings (e2e)', settings => {
  let app: FastifyApp
  let server: Server
  const token = uuid()
  const loginMock = new SwaggerLoginMock()
  const guardMock = new SwaggerGuardMock()

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
    app = await bootstrap(settings, loginMock, guardMock)
    server = app.server
    await app.ready()
  })

  afterAll(async () => await app.close())

  it('(GET) /api -', () => {
    return request(server)
      .get('/api')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(settings.loginPath + '?backUrl=/api')
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
      .expect(200)
      .then(res => {
        expect(res.text).toContain('const ui = SwaggerUIBundle(config)')
      })
  })

  it('(GET) /api/json - with Cookie', () => {
    return request(server)
      .get('/api/json')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(200)
      .then(res => {
        expect(res.text).toContain('"swagger":"2.0"')
      })
  })

  it('(POST) /login-api - with empty', async () => {
    return await request(server)
      .post(settings.loginPath)
      .expect(400)
      .then(res => {
        expect(res.body.message).toContain('body should be object')
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
        expect(res.body.message).toEqual(
          'body.login should NOT be shorter than 3 characters',
        )
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
        expect(res.body.message).toEqual(
          'body.password should NOT be shorter than 8 characters',
        )
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
        expect(res.body.message).toEqual(
          'body.login should NOT be shorter than 3 characters',
        )
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
        password: 'wrongers',
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
        expect(res.body).toEqual({ token })
      })
  })

  it('(GET) /login-api', () => {
    return request(server)
      .get(settings.loginPath)
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '/index.html?backUrl=/api',
        )
      })
  })

  it('(GET) /login-api/index.html?backUrl=/api', () => {
    return request(server)
      .get(settings.loginPath + '/index.html?backUrl=/api')
      .expect(200)
      .then(res => {
        expect(res.text).toContain('<div id="app"></div>')
      })
  })
})
