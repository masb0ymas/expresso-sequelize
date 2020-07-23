import express from 'express'

const router = express.Router()

const RoleController = require('controllers/Role/controller')

router.get('/role', RoleController.getAll)
router.get('/role/:id', RoleController.getOne)
router.post('/role', RoleController.createRole)
router.put('/role/:id', RoleController.updateRole)
router.delete('/role/:id', RoleController.deleteRole)

export default router
