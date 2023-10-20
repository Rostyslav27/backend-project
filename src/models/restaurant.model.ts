import { userService } from './../services/user.service';
import { restaurantService } from './../services/restaurant.service';
import { type IRestaurant, type IReservation, RestaurantRole, type IRoomRaw, type IRoom, IRestaurantFull, IUserProfile, IUserProfileRaw, IRestaurantRaw } from './../types';
import { roomService } from './../services/room.service';
require('dotenv').config();

export class Restaurant {
  private _restaurant: IRestaurantFull;

  constructor(restaurant:IRestaurant | IRestaurantFull) {
    if (('rooms' in restaurant) && ('profiles' in restaurant) && ('clients' in restaurant)) {
      this._restaurant = restaurant as IRestaurantFull;
    } else {
      this._restaurant = this.restaurantToFullRestaurant(restaurant);
    }
  }

  public getInfo():IRestaurantFull {
    return this._restaurant;
  }

  public sync():Promise<IRestaurantFull> {
    return new Promise((resolve, reject) => {
      restaurantService.getFullRestaurantById(this._restaurant.id).then((restaurantInfo) => {
        this._restaurant = restaurantInfo;
        resolve(this.getInfo());
      }).catch(err => {
        reject(err);
      })
    });
  }

  public restaurantToFullRestaurant(restaurant:IRestaurant):IRestaurantFull {
    return Object.assign(restaurant, { rooms: [], clients: [], profiles: []}) satisfies IRestaurantFull
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

  public hasTable(tableId:number):boolean {
    return this._restaurant.rooms.some(room => room.tables.some(table => table.id === tableId));
  }

  public edit(restaurant:IRestaurantRaw):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      restaurantService.editRestaurant(this._restaurant.id, restaurant).then(() => {
        restaurantService.getRestaurantById(this._restaurant.id).then((restaurantInfo) => {
          this._restaurant = this.restaurantToFullRestaurant(restaurantInfo);
          resolve(this.getInfo());
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  public setOrganization(organizationId:number):Promise<void> {
    return restaurantService.setOrganization(this._restaurant.id, organizationId);
  }

  public addProfile(userId:number, userProfile:IUserProfileRaw):Promise<void> {
    return userService.createUserProfile(userId, this._restaurant.id, userProfile);
  }

  public editProfile(profileId:number, userId:number | undefined, userProfile:IUserProfileRaw):Promise<void> {
    return userService.editUserProfile(profileId, userId, userProfile);
  }

  public removeProfile(profileId:number):Promise<void> {
    return userService.deleteUserProfile(profileId);
  }

  public addRoom(room:IRoomRaw):Promise<IRoom> {
    return roomService.createRoom(room, this._restaurant.id);
  }
}