
require('dotenv').config(); 
import { type Request, type Response } from 'express';
import { Reservation } from './../models/reservation.model';
import { reservationService } from './../services/reservation.service';
import { Errors } from './../types';
import { clientService } from './../services/client.service';
import { Restaurant } from './../models/restaurant.model';

class ReservationsController {

  public async editReservation(req:Request, res:Response) {
    const restaurant:Restaurant = req.body.reqRestaurant;
    const reservationId:number = +req.params.id;
    const tableId:number = +req.body.tableId;
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

      reservationService.getReservationById(reservationId).then((reservationInfo) => {
        const reservation = new Reservation(reservationInfo);

        if (restaurant.hasTable(tableId)) {
          if (clientId === 0) {
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
            reservation.edit({
              startTime: startTime || reservationInfo.startTime,
              endTime: endTime || reservationInfo.endTime,
              clientId: clientId || reservationInfo.clientId,
              tableId: tableId || reservationInfo.tableId,
              people: people || reservationInfo.people
            }).then((reservationInfo) => {
              res.json(reservationInfo);
            }).catch(err => {
              res.status(400).json(Errors.InvalidRequest);
            });
          }).catch(err => {
            res.status(400).json(Errors.InvalidRequest);
          });
        } else {
          res.status(400).json(Errors.WrongData);
        }
      }).catch(err => {
        res.status(404).json(Errors.NotExist);
      });
    }
  }
}

export const reservationsController = new ReservationsController();