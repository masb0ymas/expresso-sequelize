import express from 'express'
import passport from 'passport'

const router = express.Router()

require('config/passport')(passport)

/* always check auth */
export const AuthMiddleware = passport.authenticate('jwt', { session: false })

export default router

require('controllers/Auth/controller')
require('controllers/Role/controller')
