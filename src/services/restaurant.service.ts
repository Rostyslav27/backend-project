
import database, { RestaurantRoom, RoomTable, TableReservation, RestaurantOrganization, ReservationClient, RestaurantClient, Room, Table } from './../database';
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
        }, RestaurantOrganization, RestaurantClient]
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

  public getRestaurantByTableId(id:number):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.findAll<Model<IRestaurant>>({
        where: {
          '$rooms.tables.id$' : id
        },
        include: [{ 
          model: Room,
          as: 'rooms',
          required: true,
          include: [{
            model: Table,
            as: 'tables',
            where: { id },
            required: true,
          }]
        }]
      }).then((restaurants) => {
        if (restaurants.length) {
          resolve(restaurants[0].toJSON());
        } else {
          reject('No restaurant')
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  public createRestaurant(restaurant:IRestaurantRaw):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.create<Model<IRestaurantRaw>>({
        name: restaurant.name
      }).then((restaurant) => {
        if (restaurant) {
          const rawRestaurant:IRestaurantExact = restaurant.toJSON() as IRestaurantExact;
          resolve(Object.assign(rawRestaurant, { rooms: [], clients: [] }) as IRestaurant);
        } else { 
          reject('Restaurant was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public setOrganization(restaurantId:number, organizationId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.restaurant.update({
        organizationId,
      }, { where: { id: restaurantId } }).then(() => {
        resolve()
      }).catch(err => {
        reject(err);
      })
    });
  }
}

export const restaurantService = new RestaurantService();