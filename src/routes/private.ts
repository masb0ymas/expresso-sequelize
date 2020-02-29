import express from 'express'
import wrapperRequest from '../helpers/ExpressHelpers'
/* Declare Controllers */
import RoleController from '../controllers/RoleController'

const router = express.Router()

/* Role */
router.post('/role', wrapperRequest(RoleController.create))
router.put('/role/:id', wrapperRequest(RoleController.update))
router.delete('/role/:id', wrapperRequest(RoleController.destroy))

export default router
