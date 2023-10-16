import { type IClientFull } from './../types';
require('dotenv').config();

export class Client {
  private _client: IClientFull;

  constructor(client:IClientFull) {
    this._client = client;
  }

  public getInfo():IClientFull {
    return this._client;
  }

  public getId():number {
    return this._client.id;
  }
}