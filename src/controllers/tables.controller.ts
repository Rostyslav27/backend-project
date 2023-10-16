
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors } from '../types';
import { reservationService } from './../services/reservation.service';
import { clientService } from './../services/client.service';
import { restaurantService } from './../services/restaurant.service';
import { Restaurant } from './../models/restaurant.model';

class TablesController {
  public async createReservation(req:Request, res:Response) {
    const restaurant:Restaurant = req.body.reqRestaurant;
    const tableId:number = +req.params.id;
    const startTime:string = String(req.body.startTime || '0');
    const endTime:string = String(req.body.endTime || '0');
    const people:number = +req.body.people || 0;
    const clientName:string = String(req.body.clientName || '');
    const clientSurname:string = String(req.body.clientSurname || '');
    const clientPhone:string = String(req.body.clientPhone || '');
    const clientEmail:string = String(req.body.clientEmail || '');
    let clientId:number = +req.body.clientId;

    if (+endTime < +startTime) {
      res.status(400).json(Errors.WrongData);
    } else {
      const promiseList:Promise<any>[] = [];

      if (!clientId) {
        promiseList.push(clientService.createClient({
          name: clientName,
          surname: clientSurname,
          email: clientEmail,
          phone: clientPhone,
        }, restaurant.getId()).then((clientInfo) => {
          clientId = clientInfo.id;
        }));
      }

      Promise.all(promiseList).then(() => {
        reservationService.createReservation({ startTime, endTime, people }, tableId, clientId).then((reservationInfo) => {
          res.json(reservationInfo);
        }).catch(err => {
          res.status(400).json(Errors.InvalidRequest);
        });
      }).catch(err => {
        res.status(400).json(Errors.InvalidRequest);
      });
    }
  }
}

export const tablesController = new TablesController();