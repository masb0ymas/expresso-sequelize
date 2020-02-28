import express from 'express'
/* Declare Controllers */
import RoleController from '../controllers/RoleController'

const router = express.Router()

/* Role */
router.post('/role', RoleController.create)
router.put('/role/:id', RoleController.update)
router.delete('/role/:id', RoleController.destroy)

export default router
