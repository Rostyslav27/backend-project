import { type IReservation } from './../types';
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
}