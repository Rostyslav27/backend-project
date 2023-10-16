
import database from './../database';
import { Model } from 'sequelize';
import { type IClientRaw, type IClientFull, type IClient } from './../types';
require('dotenv').config();

export class ClientService {
  public getFullClientById(id:number):Promise<IClientFull> {
    return new Promise<IClientFull>((resolve, reject) => {
      database.models.client.findByPk<Model<IClientFull>>(id).then((client) => {
        if (client) {
          resolve(client.toJSON());
        } else {
          reject('No client')
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

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
        img: client.img,
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

  public editClient(client:IClientRaw, clientId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.client.update<Model<IClientRaw>>({
        name: client.name,
        surname: client.surname,
        birthday: client.birthday,
        note: client.note,
        gender: client.gender,
        email: client.email,
        phone: client.phone,
        img: client.img,
      }, {
        where: { id: clientId }
      }).then((count) => {
        if (count[0] > 0) {
          resolve();
        } else {
          reject('client was not updated');
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public deleteClient(clientId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.client.destroy<Model<IClientRaw>>({
        where: { id: clientId }
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const clientService = new ClientService();