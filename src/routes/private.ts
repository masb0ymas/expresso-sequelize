import express from 'express';
import passport from 'passport';
import wrapperRequest from '../helpers/ExpressHelpers';
/* Declare Controllers */
import RoleController from '../controllers/RoleController';

const router = express.Router();

require('../config/passport')(passport);

const AuthMiddleware = passport.authenticate('jwt', { session: false });

/* Role */
router.post('/role', AuthMiddleware, wrapperRequest(RoleController.create));
router.put('/role/:id', AuthMiddleware, wrapperRequest(RoleController.update));
router.delete(
  '/role/:id',
  AuthMiddleware,
  wrapperRequest(RoleController.destroy)
);

export default router;
