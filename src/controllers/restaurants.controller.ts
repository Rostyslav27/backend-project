
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors } from '../types';
import { restaurantService } from './../services/restaurant.service';
import { Restaurant } from './../models/restaurant.model';

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

  public async getReservations(req:Request, res:Response) {
    const restaurantId:number = +req.params.id;
    
    restaurantService.getRestaurantById(restaurantId, true).then((restaurantInfo) => {
      const restaurant = new Restaurant(restaurantInfo);

      res.json(restaurant.getReservations())
    }).catch(err => {
      res.status(400).json(Errors.NotExist);
    });
  }

  public async getRestaurant(req:Request, res:Response) {
    const restaurantId:number = +req.params.id;
    
    restaurantService.getRestaurantById(restaurantId, true).then((restaurant) => {
      res.json(restaurant)
    }).catch(err => {
      res.status(400).json(Errors.NotExist);
    });
  }
}

export const restaurantsController = new RestaurantsController();