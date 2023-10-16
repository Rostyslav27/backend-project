
import database from './../database';
import { Model } from 'sequelize';
import { type IRoomRaw, type IRoomFull, type IRoom } from './../types';
require('dotenv').config();

export class RoomService {
  public getRoomById(id:number):Promise<IRoom> {
    return new Promise<IRoom>((resolve, reject) => {
      database.models.room.findByPk<Model<IRoom>>(id).then((room) => {
        if (room) {
          resolve(room.toJSON());
        } else {
          reject('No room')
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  public createRoom(room:IRoomRaw, restaurantId?:number):Promise<IRoomFull> {
    return new Promise<IRoomFull>((resolve, reject) => {
      database.models.room.create<Model<IRoomRaw>>({
        name: room.name,
        restaurantId 
      }).then((room) => {
        if (room) {
          const exactRoom:IRoom = room.toJSON() as IRoom;
          resolve(Object.assign(exactRoom, { tables: [] }));
        } else { 
          reject('Room was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const roomService = new RoomService();