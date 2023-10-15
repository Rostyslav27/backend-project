
import database from './../database';
import { Model } from 'sequelize';
import { type ITableRaw, type ITable, type ITableExact } from './../types';
require('dotenv').config();

export class TableService {
  public createTable(table:ITableRaw, roomId?:number):Promise<ITable> {
    return new Promise<ITable>((resolve, reject) => {
      database.models.table.create<Model<ITableRaw>>({
        name: table.name,
        people: table.people,
        roomId 
      }).then((table) => {
        if (table) {
          const exactTable:ITableExact = table.toJSON();
          resolve(Object.assign(exactTable, { reservations: [] }) as ITable);
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