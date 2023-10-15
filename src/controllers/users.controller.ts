
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors, IUserProfile, type IUser} from '../types';
import { User } from './../models/user.model';
import { userService } from './../services/user.service';

class UsersController {
  public async login(req:Request, res:Response) { 
    const email = String(req.body.email || '');
    const password = String(req.body.password || '');

    userService.getUserByEmail(String(email)).then((userInfo) => {
      const user = new User(userInfo);
      
      if (user.getId() !== 0) {
        if (user.getToken(password)) {
          res.json({token: user.getToken(password)});
        } else {
          res.status(400).json(Errors.WrongData);
        }
      } else {
        res.status(400).json(Errors.NotExist);
      }
    }).catch((err) => {
      res.status(500).json(Errors.Unknown);
    });
  }

  public async auth(req:Request, res:Response) {
    const reqUser:User = req.body.reqUser;
    const userInfo = reqUser.getInfo();
    const userProfilesMap:{[key:string]: IUserProfile} = Object.fromEntries(userInfo.profiles.map(profile => [profile.restaurantId, profile]));
    const normalizedUserInfo:IUser = Object.assign({...userInfo}, { restaurants: [], profiles: [] });

    userInfo.restaurants.forEach(restaurant => {
      if (restaurant.organization && !restaurant.organization.blocked && userProfilesMap[restaurant.id]) {
        normalizedUserInfo.restaurants.push(restaurant);
        normalizedUserInfo.profiles.push(userProfilesMap[restaurant.id]);
      }
    });
    
    res.json(normalizedUserInfo);
  }
}

export const usersController = new UsersController();