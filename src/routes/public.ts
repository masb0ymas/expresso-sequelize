import express from 'express';
import wrapperRequest from '../helpers/ExpressHelpers';
/* Declare Controllers */
import RoleController from '../controllers/RoleController';

const router = express.Router();

/* Role */
router.get('/role', wrapperRequest(RoleController.getAll));
router.get('/role/:id', wrapperRequest(RoleController.getOne));

export default router;
