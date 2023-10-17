import { type ITableFull, type ITableRaw } from './../types';
import { tableService } from './../services/table.service';
require('dotenv').config();

export class Table {
  private _table: ITableFull;

  constructor(table:ITableFull) {
    this._table = table;
  }

  public getInfo():ITableFull {
    return this._table;
  }

  public getId():number {
    return this._table.id;
  }

  public edit(table:ITableRaw):Promise<ITableFull> {
    return new Promise<ITableFull>((resolve, reject) => {
      tableService.editTable(this._table.id, table).then(() => {
        tableService.getFullTableById(this._table.id).then((table) => {
          this._table = table;
          resolve(this._table);
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
}