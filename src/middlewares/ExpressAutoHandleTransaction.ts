/* eslint-disable @typescript-eslint/no-floating-promises */
import { LOG_SERVER } from '@config/baseURL'
import { logErrServer } from '@expresso/helpers/Formatter'
import { NextFunction, Request, Response } from 'express'
import { Transaction } from 'sequelize'

async function ExpressAutoHandleTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  res.once('finish', () => {
    const { _transaction } = req
    for (let i = 1; i <= Object.keys(_transaction).length; i += 1) {
      const txn = _transaction[i] as Transaction & {
        finished?: string
      }

      if (!txn?.finished) {
        const endpoint = req.originalUrl

        const errType = 'Sequelize Error:'
        const message = `endpoint ${endpoint} potentianlly can lead to bug`

        console.log(logErrServer(errType, message))
        console.log(`${LOG_SERVER} AUTO COMMIT!!!`)

        txn.commit()
      }
    }
  })

  next()
}

export default ExpressAutoHandleTransaction
