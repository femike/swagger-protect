import { resolve } from 'node:path'
import { fastify } from 'fastify'
import fastifyStatic from '@fastify/static'
import { SwaggerProtectLogInDto } from '@femike/swagger-protect/dist/dto/login.dto'
//
import { createSwagger, SwaggerLogin } from './swagger'

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
          `${LOGIN_API}/index.html?backUrl=${req.query.backUrl || '/api'}`,
        )
    },
  )

  application.post<{
    Body: SwaggerProtectLogInDto
  }>(
    LOGIN_API,
    {
      schema: {
        body: {
          type: 'object',
          required: ['login', 'password'],
          properties: {
            login: {
              type: 'string',
              minLength: 3,
            },
            password: {
              type: 'string',
              minLength: 8,
            },
          },
        },
      },
    },
    async (req, reply) => {
      const { login, password } = req.body
      const loginDto = new SwaggerProtectLogInDto(login, password)
      const { token } = await new SwaggerLogin().execute(loginDto)
      if (token !== '') return reply.status(201).send({ token })
      else reply.status(403).send({ message: 'Forbidden' })
    },
  )

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
