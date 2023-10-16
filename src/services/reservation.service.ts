
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

  public editReservation(reservationId:number, reservation:IReservationRaw):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.reservation.update<Model<IReservationRaw>>({
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        people: reservation.people,
        tableId: reservation.tableId,
        clientId: reservation.clientId,
      }, { where: { id: reservationId } }).then((count) => {
        if (count[0] > 0) {
          resolve();
        } else {
          reject('reservation was not updated');
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public deleteReservation(reservationId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.reservation.destroy<Model<IReservationRaw>>({ where: { id: reservationId } }).then((count) => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const reservationService = new ReservationService();