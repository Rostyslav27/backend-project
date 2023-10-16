import { type IReservation, type IReservationRaw } from './../types';
import { reservationService } from './../services/reservation.service';
require('dotenv').config();

export class Reservation {
  private _reservation: IReservation;

  constructor(reservation:IReservation) {
    this._reservation = reservation;
  }

  public getInfo():IReservation {
    return this._reservation;
  }

  public getId():number {
    return this._reservation.id;
  }

  public edit(reservation:IReservationRaw):Promise<IReservation> {
    return new Promise<IReservation>((resolve, reject) => {
      reservationService.editReservation(this._reservation.id, reservation).then(() => {
        reservationService.getReservationById(this._reservation.id).then((reservation) => {
          this._reservation = reservation;
          resolve(this._reservation);
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    }); 
  }
}