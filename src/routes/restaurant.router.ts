
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { restaurantsController } from './../controllers/restaurants.controller';
const router = express.Router();

router.post('/:id/rooms', 
  permissionMiddleware([]),
  tryTo(restaurantsController.createRoom, 'restaurantsController.createRoom')
);

router.get('/:id',
  permissionMiddleware([]),
  tryTo(restaurantsController.getRestaurant, 'restaurantsController.getRestaurant')
);

router.get('/:id/reservations',
  permissionMiddleware([]),
  tryTo(restaurantsController.getReservations, 'restaurantsController.getReservations')
);

export default router;