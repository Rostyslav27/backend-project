import express from 'express';
import userRouter from './user.router';
import organizationRouter from './organization.router';
import restaurantRouter from './restaurant.router';

const router = express.Router();

router.use('/users', userRouter);
router.use('/organizations', organizationRouter);
router.use('/restaurants', restaurantRouter);

export default router;