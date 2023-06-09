import chalk from 'chalk'
import { printLog } from 'expresso-core'
import type http from 'http'
import { env } from '~/config/env'

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

    const host = chalk.cyan(`http://localhost:${bind}`)
    const nodeEnv = chalk.blue(env.NODE_ENV)

    const msgType = `${env.APP_NAME}`
    const message = `Server listening on ${host} ⚡️ & Env: ${nodeEnv} 🚀`

    const logMessage = printLog(msgType, message)
    console.log(logMessage)
  }

  return { onError, onListening }
}
