import express from 'express';
import userRouter from './user.router';
import organizationRouter from './organization.router';
import restaurantRouter from './restaurant.router';
import roomRouter from './room.router';
import tableRouter from './table.router';
import clientRouter from './client.router';
import reservationsRouter from './reservation.router';
import profilesRouter from './profile.router';

const router = express.Router();

router.use('/users', userRouter);
router.use('/organizations', organizationRouter);
router.use('/restaurants', restaurantRouter);
router.use('/rooms', roomRouter);
router.use('/tables', tableRouter);
router.use('/clients', clientRouter);
router.use('/reservations', reservationsRouter);
router.use('/profiles', profilesRouter);

export default router;