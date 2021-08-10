import { fastify } from 'fastify'
import { createSwagger, SwaggerLogin } from './swagger'
import { SwaggerProtectLogInDto } from '@femike/swagger-protect/dist/dto/login.dto'
import fastifyStatic from 'fastify-static'
import { resolve } from 'path'

const LOGIN_API = '/login-api'

const html = `Home Page <a href="/api">API</a>`

async function bootstrap() {
  const app = fastify({
    logger: true,
  })
  const application = createSwagger(app)

  application.register(fastifyStatic, {
    root: resolve(__dirname, '../node_modules/@femike/swagger-protect-ui/dist'),
    prefix: LOGIN_API,
    decorateReply: false,
  })

  application.get<{ Querystring: { backUrl: string } }>(
    LOGIN_API,
    (req, reply) => {
      reply
        .status(302)
        .redirect(
          `/${LOGIN_API}/index.html?backUrl=${req.query.backUrl || '/api'}`,
        )
    },
  )

  application.post<{
    Body: { login: string; password: string }
  }>(LOGIN_API, req => {
    if (req.body) {
      const { login, password } = req.body
      return new SwaggerLogin().execute(
        new SwaggerProtectLogInDto(login, password),
      )
    }
  })

  application
    .get(
      '/',
      {
        schema: {
          response: {
            200: {
              type: 'string',
              example: html,
            },
          },
        },
      },
      (_, reply) => {
        reply.header('Content-Type', 'text/html; charset=utf-8').send(html)
      },
    )
    .listen(3000, (err, address) => {
      if (err) {
        app.log.error(err)
        process.exit(1)
      }
      app.log.info(`Server listening on ${address}`)
    })
}
bootstrap()
