
import database from './../database';
import { Model } from 'sequelize';
import { type ITableRaw, type ITable, type ITableFull } from './../types';
require('dotenv').config();

export class TableService {
  public getFullTableById(id:number):Promise<ITableFull> {
    return new Promise<ITableFull>((resolve, reject) => {
      database.models.table.findByPk<Model<ITableFull>>(id, { attributes: {exclude: ['createdAt', 'updatedAt']} }).then((table) => {
        if (table) {
          resolve(table.toJSON());
        } else {
          reject('No table');
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

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

  public editTable(tableId:number, table:ITableRaw):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.table.update<Model<ITableRaw>>({
        name: table.name,
        people: table.people,
      }, {
        where: { id: tableId }
      }).then((count) => {
        if (count[0] > 0) {
          resolve();
        } else {
          reject('tableId was not updated');
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public deleteTable(tableId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.table.destroy({
        where: { id: tableId }
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const tableService = new TableService();