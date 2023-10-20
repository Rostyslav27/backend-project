
require('dotenv').config(); 
import { type Request, type Response } from 'express';
import { Reservation } from './../models/reservation.model';
import { reservationService } from './../services/reservation.service';
import { Errors, type IClientFull } from './../types';
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
    let clientId:number | null = req.body.clientId === null ? null : +req.body.clientId;
    let client:IClientFull | undefined = undefined;

    if (+endTime < +startTime) {
      res.status(400).json(Errors.WrongData);
    } else {
      const promiseList:Promise<any>[] = [];

      restaurant.sync().then(() => {
        reservationService.getReservationById(reservationId).then((reservationInfo) => {
          const reservation = new Reservation(reservationInfo);
  
          if (restaurant.hasTable(tableId)) {
            if (clientId === 0 && !!(clientName || clientSurname || clientPhone || clientEmail)) {
              promiseList.push(clientService.createClient({
                name: clientName,
                surname: clientSurname,
                email: clientEmail,
                phone: clientPhone,
              }, restaurant.getId()).then((clientInfo) => {
                clientId = clientInfo.id;
                client = clientInfo;
              }));
            } else if (clientId === 0) {
              clientId = null;
            }
    
            Promise.all(promiseList).then(() => {
              reservation.edit({
                startTime: startTime || reservationInfo.startTime,
                endTime: endTime || reservationInfo.endTime,
                clientId: clientId === null ? clientId : clientId || reservationInfo.clientId,
                tableId: tableId || reservationInfo.tableId,
                people: people || reservationInfo.people
              }).then((reservationInfo) => {
                res.json(Object.assign(reservationInfo, { client: clientId ? client : undefined }));
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
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      });;
    }
  }

  public async deleteReservation(req:Request, res:Response) {
    const reservationId:number = +req.params.id;

    reservationService.deleteReservation(reservationId).then(() => {
      res.json('success');
    }).catch(err => {
      res.status(500).json(Errors.Unknown);
    })
  }
}

export const reservationsController = new ReservationsController();