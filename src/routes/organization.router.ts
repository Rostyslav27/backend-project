
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { organizationsController } from './../controllers/organizations.controller';
const router = express.Router();

router.get('/',
  permissionMiddleware([]),
  tryTo(organizationsController.getOrganizations, 'organizationsController.getOrganizations')
);

router.post('/', 
  permissionMiddleware([]),
  validateBody(['userEmail', 'tarrif']).notEmpty().trim().escape(),
  validateBody(['tarrif']).isNumeric(),
  validateBody(['userEmail']).isEmail(),
  checkValidation,
  tryTo(organizationsController.createOrganization, 'organizationsController.createOrganization')
);

router.put('/:id', 
  permissionMiddleware([]),
  tryTo(organizationsController.editOrganization, 'organizationsController.editOrganization')
);

export default router;