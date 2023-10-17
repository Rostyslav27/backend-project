
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors, IRestaurant, IRestaurantFull } from '../types';
import { restaurantService } from './../services/restaurant.service';
import { Restaurant } from './../models/restaurant.model';
import { clientService } from './../services/client.service';

class RestaurantsController {
  public async createRoom(req:Request, res:Response) {
    const name:string = String(req.body.name || '');
    const restaurantId:number = +req.params.id;
    
    restaurantService.getRestaurantById(restaurantId).then((restaurantInfo) => {
      const restaurant = new Restaurant(restaurantInfo);
      restaurant.addRoom({ name }).then((room) => {
        res.json(room);
      }).catch(err => {
        res.status(500).json(Errors.Unknown);
      })
    }).catch(err => {
      res.status(400).json(Errors.NotExist);
    });
  }

  public async createClient(req:Request, res:Response) {
    const restaurantId:number = +req.params.id;
    const name:string | undefined = String(req.body.name || '') || undefined;
    const surname:string | undefined = String(req.body.surname || '') || undefined;
    const email:string | undefined = String(req.body.email || '') || undefined;
    const phone:string | undefined = String(req.body.phone || '') || undefined;
    const birthday:string | undefined = String(req.body.birthday || '') || undefined;
    const gender:string | undefined = String(req.body.gender || '') || undefined;
    const note:string | undefined = String(req.body.note || '') || undefined;

    clientService.createClient({
      name,
      surname,
      email,
      phone,
      birthday,
      gender,
      note,
    }, restaurantId).then((clientInfo) => {
      res.json(clientInfo);
    }).catch(err => {
      console.error(err);
      res.status(403).json(Errors.NotExist);
    });
  }

  public async getReservations(req:Request, res:Response) {
    const restaurantId:number = +req.params.id;
    
    restaurantService.getFullRestaurantById(restaurantId).then((restaurantInfo) => {
      const restaurant = new Restaurant(restaurantInfo);

      res.json(restaurant.getReservations())
    }).catch(err => {
      res.status(400).json(Errors.NotExist);
    });
  }

  public async getRestaurant(req:Request, res:Response) {
    const restaurantId:number = +req.params.id;
    
    restaurantService.getFullRestaurantById(restaurantId).then((restaurant) => {
      res.json(restaurant)
    }).catch(err => {
      res.status(400).json(Errors.NotExist);
    });
  }
}

export const restaurantsController = new RestaurantsController();