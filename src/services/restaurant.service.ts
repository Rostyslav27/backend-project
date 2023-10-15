
import database, { RestaurantRoom, RoomTable, TableReservation, RestaurantOrganization, ReservationClient } from './../database';
import { Model } from 'sequelize';
import { type IRestaurant, type IRestaurantRaw, type IRestaurantExact } from './../types';
require('dotenv').config();

export class RestaurantService {
  public getRestaurantById(id:number, nested?:boolean):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.findByPk<Model<IRestaurant>>(id, nested ? {
        include: [{ 
          association: RestaurantRoom,
          include: [{
            association: RoomTable,
            include: [{
              association: TableReservation,
              include: [ReservationClient]
            }]
          }]
        }, RestaurantOrganization]
      } : {} ).then((restaurant) => {
        if (restaurant) {
          resolve(restaurant.toJSON());
        } else {
          reject('No restaurant')
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  public createRestaurant(restaurant:IRestaurantRaw):Promise<IRestaurantExact> {
    return new Promise<IRestaurantExact>((resolve, reject) => {
      database.models.restaurant.create<Model<IRestaurantRaw>>({
        name: restaurant.name
      }).then((restaurant) => {
        if (restaurant) {
          resolve(restaurant.toJSON() as IRestaurantExact);
        } else { 
          reject('Restaurant was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const restaurantService = new RestaurantService();