import { userService } from './../services/user.service';
import { restaurantService } from './../services/restaurant.service';
import { type IRestaurant, type IReservation, RestaurantRole, type IRoomRaw, type IRoom } from './../types';
import { roomService } from './../services/room.service';
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

  public setOrganization(organizationId:number):Promise<void> {
    return restaurantService.setOrganization(this._restaurant.id, organizationId);
  }

  public addUser(userId:number, userRole:RestaurantRole):Promise<void> {
    return userService.addUserToRestaurant(userId, this._restaurant.id, userRole);
  }

  public addRoom(room:IRoomRaw):Promise<IRoom> {
    return roomService.createRoom(room, this._restaurant.id);
  }
}