
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { restaurantPermissionMiddleware } from './../middleware/restaurantPermission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { tablesController } from './../controllers/tables.controller';
const router = express.Router();

router.post('/:id/reservations', 
  validateBody(['startTime', 'endTime']).notEmpty().isNumeric(),
  validateBody(['tableId', 'clientId', 'people']).optional().isNumeric(),
  checkValidation,
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(tablesController.createReservation, 'tablesController.createReservation')
);

export default router;