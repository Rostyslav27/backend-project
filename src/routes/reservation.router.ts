
import express from 'express';
import { body, body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { restaurantPermissionMiddleware } from './../middleware/restaurantPermission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { reservationsController } from './../controllers/reservations.controller';
const router = express.Router();

router.put('/:id', 
  body(['tableId', 'startTime', 'endTime', 'clientId', 'people']).optional().isNumeric(),
  checkValidation,
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(reservationsController.editReservation, 'reservationsController.editReservation')
);

export default router;