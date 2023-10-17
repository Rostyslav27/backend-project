
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { restaurantsController } from './../controllers/restaurants.controller';
import { restaurantPermissionMiddleware } from './../middleware/restaurantPermission.middleware';
const router = express.Router();

router.post('/:id/rooms', 
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(restaurantsController.createRoom, 'restaurantsController.createRoom')
);

router.post('/:id/clients', 
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(restaurantsController.createClient, 'restaurantsController.createClient')
);

router.get('/:id',
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(restaurantsController.getRestaurant, 'restaurantsController.getRestaurant')
);

router.get('/:id/reservations',
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(restaurantsController.getReservations, 'restaurantsController.getReservations')
);

router.post('/:id/users',
  validateBody(['email']).isEmail().notEmpty(),
  validateBody(['role']).isAlpha().notEmpty(),
  checkValidation,
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(restaurantsController.createEmployee, 'restaurantsController.createEmployee')
);

export default router;