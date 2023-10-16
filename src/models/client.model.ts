import { type IClientFull, type IClientRaw } from './../types';
import { clientService } from './../services/client.service';
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

  public edit(client:IClientRaw):Promise<IClientFull> {
    return new Promise<IClientFull>((resolve, reject) => {
      clientService.editClient(this._client.id, client).then(() => {
        clientService.getFullClientById(this._client.id).then((client) => {
          this._client = client;
          resolve(this._client);
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
}