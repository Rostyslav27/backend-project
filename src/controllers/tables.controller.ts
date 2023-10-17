
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors } from '../types';
import { reservationService } from './../services/reservation.service';
import { clientService } from './../services/client.service';
import { tableService } from './../services/table.service';
import { Restaurant } from './../models/restaurant.model';
import { Table } from './../models/table.model';

class TablesController {
  public async editTable(req:Request, res:Response) {
    const tableId:number = +req.params.id;
    const name:string = String(req.body.name || '');
    const people:number = req.body.people;

    tableService.getFullTableById(tableId).then((tableInfo) => {
      const table = new Table(tableInfo);

      table.edit({
        name: name || tableInfo.name,
        people: people || tableInfo.people,
      }).then((tableInfo) => {
        res.json(tableInfo);
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      });
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.NotExist);
    });
  }

  public async deleteTable(req:Request, res:Response) {
    const tableId:number = +req.params.id;

    tableService.deleteTable(tableId).then(() => {
      res.json('success');
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.Exist);
    });
  }

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
    let clientId:number | null = req.body.clientId === null ? null : +req.body.clientId;

    if (+endTime < +startTime) {
      res.status(400).json(Errors.WrongData);
    } else {
      const promiseList:Promise<any>[] = [];

      if (clientId === 0 && !!(clientName || clientSurname || clientPhone || clientEmail)) {
        promiseList.push(clientService.createClient({
          name: clientName,
          surname: clientSurname,
          email: clientEmail,
          phone: clientPhone,
        }, restaurant.getId()).then((clientInfo) => {
          clientId = clientInfo.id;
        }));
      } else if (clientId === 0) {
        clientId = null;
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