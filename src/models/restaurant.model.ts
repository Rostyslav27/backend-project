import { type IRestaurant, type IReservation } from './../types';
require('dotenv').config();

export class Restaurant {
  private _restaurant: IRestaurant;

  constructor(restaurant:IRestaurant) {
    this._restaurant = restaurant;
  }

  public getInfo():IRestaurant {
    return this._restaurant;
  }

  public getReservations():IReservation[] {
    let reservations:IReservation[] = [];

    if (this._restaurant.rooms && this._restaurant.rooms.length) {
      this._restaurant.rooms.forEach(room => {
        if (room.tables && room.tables.length) {
          room.tables.forEach((table) => {
            if (table.reservations && table.reservations.length) {
              table.reservations.forEach((reservation) => {
                reservations.push(reservation);
              });
            }
          });
        }
      });
    }

    return reservations;
  }

  public getId():number {
    return this._restaurant.id;
  }
}