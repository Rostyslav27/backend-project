
import express from 'express';
import { body as validateBody } from 'express-validator';
import { checkValidation } from './../middleware/checkValidation.middleware';
import { permissionMiddleware } from './../middleware/permission.middleware';
import { tryTo } from './../middleware/try.middleware';
import { roomsController } from './../controllers/rooms.controller';
const router = express.Router();

router.post('/:id/tables',
  permissionMiddleware([]),
  tryTo(roomsController.createTable, 'roomsController.createTable')
);

export default router;