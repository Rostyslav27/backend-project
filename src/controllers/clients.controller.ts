
require('dotenv').config(); 
import { type Request, type Response } from 'express';
import { Organization } from './../models/organization.model';
import { Client } from './../models/client.model';
import { clientService } from './../services/client.service';
import { Errors } from './../types';

class ClientsController {
  // TODO: only users from organization can edit clients 
  public async editClient(req:Request, res:Response) {
    const clientId:number = +req.params.id;
    const name:string = String(req.body.name || '');
    const surname:string = String(req.body.surname || '');
    const email:string = String(req.body.email || '');
    const phone:string = String(req.body.phone || '');
    const birthday:string = String(req.body.birthday || '');
    const gender:string = String(req.body.gender || '');
    const note:string = String(req.body.note || '');
    const tags:string = req.body.tags && req.body.tags.length ? req.body.tags.filter((tag:any) => typeof tag === 'number').map((tag:number) => +tag) : [];

    clientService.getFullClientById(clientId).then((clientInfo) => {
      const client = new Client(clientInfo);

      client.edit({
        name: name || clientInfo.name,
        surname: surname || clientInfo.surname,
        email: email || clientInfo.email,
        phone: phone || clientInfo.phone,
        birthday: birthday || clientInfo.birthday,
        gender: gender || clientInfo.gender,
        note: note || clientInfo.note,
      }).then((clientInfo) => {
        res.json(clientInfo);
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      });
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.NotExist);
    });
  }

  public async deleteClient(req:Request, res:Response) {
    const clientId:number = +req.params.id;

    clientService.deleteClient(clientId).then(() => {
      res.json('success');
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.Exist);
    });
  }
}

export const clientsController = new ClientsController();