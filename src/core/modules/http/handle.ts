import { blue, cyan, green } from 'colorette'
import type http from 'http'
import { env } from '~/config/env'
import { logger } from '~/config/pino'

export function httpHandle(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  port: number
): {
  onError: (error: { syscall: string; code: string }) => void
  onListening: () => void
} {
  /**
   * Handle HTTP Error
   * @param port
   * @param error
   */
  const onError = (error: { syscall: string; code: string }): void => {
    if (error.syscall !== 'listen') {
      throw new Error()
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw new Error()
    }
  }

  /**
   * On Listenting HTTP
   * @param server
   */
  const onListening = (): void => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `${addr}` : `${addr?.port}`

    const host = cyan(`http://localhost:${bind}`)
    const nodeEnv = blue(env.NODE_ENV)

    const msgType = green(`${env.APP_NAME}`)
    const message = `server listening on ${host} ⚡️ & env: ${nodeEnv} 🚀`

    logger.info(`${msgType} - ${message}`)
  }

  return { onError, onListening }
}
