
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { usersController } from './../controllers/users.controller';
const router = express.Router();

router.post('/login', 
  permissionMiddleware([], { authorization: false }),
  validateBody(['email', 'password']).notEmpty().trim().escape(),
  checkValidation,
  tryTo(usersController.login, 'usersController.login')
);

router.get('/auth',
  permissionMiddleware([]),
  tryTo(usersController.auth, 'usersController.auth')
);

export default router;