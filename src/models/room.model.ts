import { ITableRaw, type IRoom, type ITable } from './../types';
import { roomService } from './../services/room.service';
import { tableService } from './../services/table.service';
require('dotenv').config();

export class Room {
  private _room: IRoom;

  constructor(room:IRoom) {
    this._room = room;
  }

  public getInfo():IRoom {
    return this._room;
  }

  public getId():number {
    return this._room.id;
  }

  public addTable(table:ITableRaw):Promise<ITable> {
    return tableService.createTable(table, this._room.id);
  }
}