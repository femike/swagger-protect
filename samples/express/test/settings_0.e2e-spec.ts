import {
  ENTRY_POINT_PROTECT,
  SWAGGER_COOKIE_TOKEN_KEY,
  REDIRECT_TO_LOGIN,
} from '@femike/swagger-protect/dist/constatnt'
import * as request from 'supertest'
import { v4 as uuid } from 'uuid'
import type { Express } from 'express'
import * as express from 'express'
// import * as cookieParser from 'cookie-parser'
import { createSwagger } from './swagger'

describe.each([
  {
    cookieKey: SWAGGER_COOKIE_TOKEN_KEY,
    loginPath: REDIRECT_TO_LOGIN,
    swaggerPath: ENTRY_POINT_PROTECT,
  },
])('Default settings (e2e)', settings => {
  let app: Express
  const token = uuid()

  beforeAll(async () => {
    app = express()
    // app.use(cookieParser())
    app = createSwagger(app, {
      guard: () => false,
    })
  })

  it('(GET) /api -', () => {
    return request(app)
      .get('/api')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(settings.loginPath + '?backUrl=/api')
      })
  })

  it('(GET) /api/ -', () => {
    return request(app)
      .get('/api/')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(settings.loginPath + '?backUrl=/api/')
      })
  })

  it('(GET) /api-json -', () => {
    return request(app)
      .get('/api-json')
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '?backUrl=/api-json',
        )
      })
  })

  it('(GET) /api/ - with Cookie and unregistered token', () => {
    return request(app)
      .get('/api/')
      .set({
        Cookie: `${settings.cookieKey}=${uuid()}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(settings.loginPath + '?backUrl=/api/')
      })
  })

  it('(GET) /api-json - with Cookie and unregistered token', () => {
    return request(app)
      .get('/api-json')
      .set({
        Cookie: `${settings.cookieKey}=${uuid()}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '?backUrl=/api-json',
        )
      })
  })

  it('(GET) /api/ - with Cookie', () => {
    return request(app)
      .get('/api/')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(settings.loginPath + '?backUrl=/api/')
      })
  })

  it('(GET) /api-json - with Cookie', () => {
    return request(app)
      .get('/api-json')
      .set({
        Cookie: `${settings.cookieKey}=${token}`,
      })
      .expect(302)
      .then(res => {
        expect(res.header.location).toBe(
          settings.loginPath + '?backUrl=/api-json',
        )
      })
  })

  it('(POST) /login-api - must be disabled', () => {
    return request(app).post(settings.loginPath).expect(404)
  })

  it('(GET) /login-api - must be disabled', () => {
    return request(app).post(settings.loginPath).expect(404)
  })
})
