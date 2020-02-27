import express from 'express'
import publicRoute from './public'
import privateRoute from './private'

const router = express.Router()

router.use('/v1', publicRoute)
router.use('/v1', privateRoute)

export default router
