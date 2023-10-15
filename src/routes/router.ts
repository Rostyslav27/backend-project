import express from 'express';
import userRouter from './user.router';
import organizationRouter from './organization.router';

const router = express.Router();

router.use('/users', userRouter);
router.use('/organizations', organizationRouter);

export default router;