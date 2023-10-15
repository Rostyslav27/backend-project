
import database, { ReservationClient } from './../database';
import { Model } from 'sequelize';
import { type IReservationRaw, type IReservation } from './../types';
require('dotenv').config();

export class ReservationService {

  public getReservationById(id:number):Promise<IReservation> {
    return new Promise<IReservation>((resolve, reject) => {
      database.models.reservation.findByPk<Model<IReservation>>(id).then((reservation) => {
        if (reservation) {
          resolve(reservation.toJSON());
        } else {
          reject('No reservation')
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  public createReservation(reservation:IReservationRaw, tableId:number, clientId:number):Promise<IReservation> {
    return new Promise<IReservation>((resolve, reject) => {
      database.models.reservation.create<Model<IReservationRaw>>({
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        people: reservation.people,
        tableId: tableId,
        clientId: clientId,
      }).then((reservation) => {
        if (reservation) {
          resolve(reservation.toJSON() as IReservation);
        } else { 
          reject('Reservation was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const reservationService = new ReservationService();