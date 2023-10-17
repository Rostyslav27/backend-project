
import database, { RestaurantRoom, RoomTable, TableReservation, RestaurantOrganization, Reservation, RestaurantClient, Room, Table, User, UserProfileUser } from './../database';
import { Model } from 'sequelize';
import { type IRestaurant, type IRestaurantRaw, type IRestaurantFull } from './../types';
require('dotenv').config();

export class RestaurantService {
  public getFullRestaurantById(id:number):Promise<IRestaurantFull> {
    return new Promise<IRestaurantFull>((resolve, reject) => {
      database.models.restaurant.findByPk<Model<IRestaurantFull>>(id, {
        include: [{ 
          association: RestaurantRoom,
          attributes: {exclude: ['createdAt', 'updatedAt']},
          include: [{
            association: RoomTable,
            attributes: {exclude: ['createdAt', 'updatedAt']},
            include: [{
              association: TableReservation,
              attributes: {exclude: ['createdAt', 'updatedAt']},
            }]
          }]
        }, {  
          association: RestaurantOrganization,
          attributes: {exclude: ['createdAt', 'updatedAt']},
        }, {  
          model: User,
          attributes: {exclude: ['createdAt', 'updatedAt', 'password']},
          include: [{
            association: UserProfileUser,
            where: {
              restaurantId: id,
            }
          }]
        }, {
          association: RestaurantClient,
          attributes: {exclude: ['createdAt', 'updatedAt']},
        }],
        attributes: {exclude: ['createdAt', 'updatedAt']},
      }).then((restaurant) => {
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

  public getRestaurantById(id:number):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.findByPk<Model<IRestaurant>>(id, {
        attributes: {exclude: ['createdAt', 'updatedAt']},
      }).then((restaurant) => {
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

  public getRestaurantByRoomId(id:number):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.findAll<Model<IRestaurant>>({
        where: {
          '$rooms.id$' : id
        },
        include: [{ 
          model: Room,
          as: 'rooms',
          required: true,
          where: { id },
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

  public getRestaurantByClientId(id:number):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.findAll<Model<IRestaurant>>({
        where: {
          '$clients.id$' : id
        },
        include: [{ 
          association: RestaurantClient,
          as: 'clients',
          required: true,
          where: { id },
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

  public getRestaurantByReservationId(id:number):Promise<IRestaurant> {
    return new Promise<IRestaurant>((resolve, reject) => {
      database.models.restaurant.findAll<Model<IRestaurant>>({
        where: {
          '$rooms.tables.reservations.id$' : id
        },
        include: [{ 
          model: Room,
          as: 'rooms',
          required: true,
          include: [{
            model: Table,
            as: 'tables',
            required: true,
            include: [{
              model: Reservation,
              as: 'reservations',
              required: true,
              where: { id }
            }]
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

  public createRestaurant(restaurant:IRestaurantRaw):Promise<IRestaurantFull> {
    return new Promise<IRestaurantFull>((resolve, reject) => {
      database.models.restaurant.create<Model<IRestaurantRaw>>({
        name: restaurant.name
      }).then((restaurant) => {
        if (restaurant) {
          const rawRestaurant:IRestaurant = restaurant.toJSON() as IRestaurant;
          resolve(Object.assign(rawRestaurant, { rooms: [], clients: [], users: [] }) satisfies IRestaurantFull);
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