
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { clientsController } from './../controllers/clients.controller';
const router = express.Router();

router.put('/:id', 
  permissionMiddleware([]),
  tryTo(clientsController.editClient, 'clientsController.editClient')
);

router.delete('/:id', 
  permissionMiddleware([]),
  tryTo(clientsController.deleteClient, 'clientsController.deleteClient')
);

export default router;