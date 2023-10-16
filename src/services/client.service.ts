
import database from './../database';
import { Model } from 'sequelize';
import { type IClientRaw, type IClientFull, type IClient } from './../types';
require('dotenv').config();

export class ClientService {

  public createClient(client:IClientRaw, restaurantId:number):Promise<IClientFull> {
    return new Promise<IClientFull>((resolve, reject) => {
      database.models.client.create<Model<IClientRaw>>({
        name: client.name,
        surname: client.surname,
        birthday: client.birthday,
        note: client.note,
        gender: client.gender,
        email: client.email,
        phone: client.phone,
        restaurantId: restaurantId
      }).then((client) => {
        if (client) {
          const exactClient:IClient = client.toJSON() as IClient;
          resolve(Object.assign(exactClient, { tags: [] }));
        } else { 
          reject('Client was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const clientService = new ClientService();