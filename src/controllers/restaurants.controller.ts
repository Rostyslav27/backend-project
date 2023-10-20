
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors, type IRestaurant, type IRestaurantFull, Role, RestaurantRole } from '../types';
import { restaurantService } from './../services/restaurant.service';
import { Restaurant } from './../models/restaurant.model';
import { clientService } from './../services/client.service';
import { userService } from './../services/user.service';
import { User } from './../models/user.model';

class RestaurantsController {
  public async editRestaurant(req:Request, res:Response) {
    const restaurant:Restaurant = req.body.reqRestaurant;
    const name:string = String(req.body.name || '');
    const img:string = String(req.body.img || '');
    const type:string = String(req.body.type || '');
    const country:string = String(req.body.country || '');
    const city:string = String(req.body.city || '');
    const address:string = String(req.body.address || '');
    const phone:string = String(req.body.phone || '');
    const email:string = String(req.body.email || '');
    const tax:string = String(req.body.tax || '');
    const website:string = String(req.body.website || '');
    const description:string = String(req.body.description || '');
    const reservationDuration:number = +req.body.reservationDuration || 0;
    const document:string = String(req.body.document || '');

    const restaurantInfo = restaurant.getInfo();

    restaurant.edit({
      name: restaurantInfo.name || name,
      img: restaurantInfo.img || img,
      type: restaurantInfo.type || type, 
      country: restaurantInfo.country || country,
      city: restaurantInfo.city || city,
      address: restaurantInfo.address || address,
      phone: restaurantInfo.phone || phone,
      email: restaurantInfo.email || email,
      tax: restaurantInfo.tax || tax,
      website: restaurantInfo.website || website,
      description: restaurantInfo.description || description,
      reservationDuration: restaurantInfo.reservationDuration || reservationDuration,
      document: restaurantInfo.document || document,
    }).then((restaurantInfo) => {
      res.json(restaurantInfo);
    }).catch(err => {
      console.error(err);
      res.status(500).json(Errors.Unknown);
    });
  }

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

  public async createEmployee(req:Request, res:Response) {
    const restaurant:Restaurant = req.body.reqRestaurant;
    const email:string = String(req.body.email || '');
    const role:RestaurantRole = String(req.body.role || '') as RestaurantRole;
    const name:string | undefined = String(req.body.name || '') || undefined;
    const surname:string | undefined = String(req.body.surname || '') || undefined;
    const phone:string | undefined = String(req.body.phone || '') || undefined;
    const birthday:string | undefined = String(req.body.birthday || '') || undefined;
    const gender:string | undefined = String(req.body.gender || '') || undefined;
    const note:string | undefined = String(req.body.note || '') || undefined;

    userService.createOrGetFullUserByEmail({ email, role: Role.User, password: String(Math.random()) }).then((userInfo) => {
      const user = new User(userInfo);
      restaurant.addProfile(userInfo.id, {
        role, name, surname, phone, birthday, gender, note
      }).then(() => {
        user.sync().then(() => {
          res.json(user.getProfile(restaurant.getId()));
        }).catch(err => {
          res.status(500).json(Errors.Unknown);
        });
      }).catch(err => {
        res.status(400).json('failed to add user to the restaurant');
      })
    }).catch((err) => {
      res.status(500).json(Errors.Unknown);
    });
  }
}

export const restaurantsController = new RestaurantsController();