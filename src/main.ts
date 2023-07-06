import http from 'http'
import { App } from './config/app'
import { env } from './config/env'
import { httpHandle } from './core/modules/http/handle'

function bootstrap(): void {
  const port = env.APP_PORT

  // create express app
  const app = new App().create()

  const server = http.createServer(app)

  // http handle
  const { onError, onListening } = httpHandle(server, port)

  // run server listen
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
}

bootstrap()
