require('dotenv').config(); 

// types
import { Errors, IRestaurant } from './../types';
import { Request, Response, NextFunction } from 'express';

// objects 
import { restaurantService } from './../services/restaurant.service';
import { RestaurantRole, type IRestaurantFull } from './../types';
import { User } from './../models/user.model';
import { Restaurant } from './../models/restaurant.model';

export const restaurantPermissionMiddleware = (roles:RestaurantRole[], options:{self?:boolean} = {}) => {
  return async function(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const user:User = req.body.reqUser;

      let getRestaurantMethod:Promise<IRestaurant> | undefined = undefined;

      if (req.baseUrl === '/reservations') {
        getRestaurantMethod = restaurantService.getRestaurantByReservationId(+req.params.id)
      }

      if (req.baseUrl === '/tables') {
        getRestaurantMethod = restaurantService.getRestaurantByTableId(+req.params.id)
      }

      if (getRestaurantMethod) {
        getRestaurantMethod.then((restaurantInfo) => {
          const restaurant = new Restaurant(restaurantInfo);
          let havePermission:boolean = user.hasRestaurantPermisson(roles, restaurantInfo.id);

          if (havePermission) {
            req.body.reqRestaurant = restaurant;
            next();
          } else {
            res.status(400).json(Errors.PermissionDenied);
          }

        }).catch(err => {
          res.status(404).json('can not fint restaurant by the reservation');
        })
      } else {
        res.status(500).json('no method to get restaurant');
      }
    } catch(err:any) {
      res.status(500).json(Errors.Unknown);
    }
  }
}
