
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { roomsController } from './../controllers/rooms.controller';
import { restaurantPermissionMiddleware } from './../middleware/restaurantPermission.middleware';
const router = express.Router();

router.put('/:id',
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(roomsController.editRoom, 'roomsController.editRoom')
);

router.delete('/:id',
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(roomsController.deleteRoom, 'roomsController.deleteRoom')
);

router.post('/:id/tables',
  validateBody(['people']).optional().isNumeric(),
  checkValidation,
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(roomsController.createTable, 'roomsController.createTable')
);

export default router;