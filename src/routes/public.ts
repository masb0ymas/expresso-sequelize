import express from 'express'

const router = express.Router()

export default router

require('controllers/Auth/controller')
require('controllers/Role/controller')
require('controllers/User/controller')
require('controllers/RefreshToken/controller')
require('controllers/Session/controller')
