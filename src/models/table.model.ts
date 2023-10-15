import { type ITable } from './../types';
import { tableService } from './../services/table.service';
require('dotenv').config();

export class Table {
  private _table: ITable;

  constructor(table:ITable) {
    this._table = table;
  }

  public getInfo():ITable {
    return this._table;
  }

  public getId():number {
    return this._table.id;
  }
}