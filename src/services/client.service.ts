
import database from './../database';
import { Model } from 'sequelize';
import { type IClientRaw, type IClient, type IClientExact } from './../types';
require('dotenv').config();

export class ClientService {
  
  public getClients(restaurantId:number):Promise<IClient[]> {
    return new Promise<IClient[]>((resolve, reject) => {
      database.models.client.findAll({ where: { restaurantId }, raw: true }).then((clients:any) => {
        resolve(clients as IClient[]);
      }).catch(err => {
        reject(err);
      });
    });
  }

  public createClient(client:IClientRaw, restaurantId:number):Promise<IClient> {
    return new Promise<IClient>((resolve, reject) => {
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
          const exactClient:IClientExact = client.toJSON() as IClientExact;
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