import express from 'express'
import passport from 'passport'

const router = express.Router()

require('config/passport')(passport)

/* always check auth */
const AuthMiddleware = passport.authenticate('jwt', { session: false })
router.use(AuthMiddleware)

export default router

require('controllers/User/controller')
