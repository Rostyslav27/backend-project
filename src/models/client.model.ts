import { type IClient } from './../types';
require('dotenv').config();

export class Client {
  private _client: IClient;

  constructor(client:IClient) {
    this._client = client;
  }

  public getInfo():IClient {
    return this._client;
  }

  public getId():number {
    return this._client.id;
  }
}