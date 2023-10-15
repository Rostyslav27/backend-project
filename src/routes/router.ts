import express from 'express';
import organizationRouter from './organization.router';

const router = express.Router();

router.use('/organizations', organizationRouter);

export default router;