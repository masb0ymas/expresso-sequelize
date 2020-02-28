import express from 'express'
/* Declare Controllers */
import RoleController from '../controllers/RoleController'

const router = express.Router()

/* Role */
router.get('/role', RoleController.getAll)
router.get('/role/:id', RoleController.getOne)

export default router
