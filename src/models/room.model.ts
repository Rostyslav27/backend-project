import { type ITableRaw, type IRoom, type ITableFull, type IRoomFull, type IRoomRaw } from './../types';
import { roomService } from './../services/room.service';
import { tableService } from './../services/table.service';
require('dotenv').config();

export class Room {
  private _room: IRoomFull;

  constructor(room:IRoomFull | IRoom) {
    if ('tables' in room) {
      this._room = room;
    } else {
      this._room = this.roomToFullRoom(room);
    }
  }

  public getInfo():IRoomFull {
    return this._room;
  }

  public getId():number {
    return this._room.id;
  }

  public addTable(table:ITableRaw):Promise<ITableFull> {
    return tableService.createTable(table, this._room.id);
  }

  public roomToFullRoom(room:IRoom):IRoomFull {
    return Object.assign(room, { tables: [] });
  }

  public edit(room:IRoomRaw):Promise<IRoomFull> {
    return new Promise<IRoomFull>((resolve, reject) => {
      roomService.editRoom(this._room.id, room).then(() => {
        roomService.getRoomById(this._room.id).then((room) => {
          this._room = this.roomToFullRoom(room);
          resolve(this._room);
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
}