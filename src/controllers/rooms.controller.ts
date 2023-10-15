
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors } from '../types';
import { roomService } from './../services/room.service';
import { Room } from './../models/room.model';

class RoomsController {
  public async createTable(req:Request, res:Response) {
    const name:string = String(req.body.name || '');
    const people:number = req.body.people;
    const roomId:number = +req.params.id;
    
    roomService.getRoomById(roomId).then((roomInfo) => {
      const room = new Room(roomInfo);
      room.addTable({ name, people }).then((table) => {
        res.json(table);
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      })
    }).catch(err => {
      res.status(400).json(Errors.NotExist);
    });
  }
}

export const roomsController = new RoomsController();