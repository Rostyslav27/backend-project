
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { restaurantPermissionMiddleware } from './../middleware/restaurantPermission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { profilesController } from './../controllers/profiles.controller';
const router = express.Router();

router.put('/:id', 
  validateBody(['email']).optional().isEmail(),
  checkValidation,
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(profilesController.editProfile, 'profilesController.editProfile')
);

router.delete('/:id', 
  permissionMiddleware([]),
  restaurantPermissionMiddleware([]),
  tryTo(profilesController.deleteProfile, 'profilesController.deleteEmployee')
);

export default router;