
import database from './../database';
import { Model } from 'sequelize';
import { type ITableRaw, type ITable, type ITableFull } from './../types';
require('dotenv').config();

export class TableService {
  public createTable(table:ITableRaw, roomId?:number):Promise<ITableFull> {
    return new Promise<ITableFull>((resolve, reject) => {
      database.models.table.create<Model<ITableRaw>>({
        name: table.name,
        people: table.people,
        roomId 
      }).then((table) => {
        if (table) {
          const exactTable:ITable = table.toJSON();
          resolve(Object.assign(exactTable, { reservations: [] }));
        } else { 
          reject('Table was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const tableService = new TableService();