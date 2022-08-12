import express from 'express'
import { createSwagger } from './swagger'
import cookieParser from 'cookie-parser'
const app = express()

app.get('/', (req, res) => res.send('Home Page <a href="/api">API</a>'))

async function bootstrap() {
  app.use(cookieParser())
  createSwagger(app).listen(3000, () => {
    console.log(`Application is running on: http://localhost:3000`)
  })
}
bootstrap()
