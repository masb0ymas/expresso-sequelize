import { Transaction } from 'sequelize'
import { NextFunction, Response, Request } from 'express'

async function ExpressAutoHandleTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.once('finish', () => {
    const { _transaction } = req
    for (let i = 1; i <= Object.keys(_transaction).length; i += 1) {
      const txn = _transaction[i] as Transaction & {
        finished?: string
      }
      if (!txn?.finished) {
        const endpoint = req.originalUrl
        console.warn(`endpoint ${endpoint} potentianlly can lead to bug`)
        console.log('AUTO COMMIT!!!')
        txn.commit()
      }
    }
  })

  next()
}

export default ExpressAutoHandleTransaction
