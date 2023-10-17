
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors, type IUserProfile, type IUserFull } from '../types';
import { User } from './../models/user.model';
import { userService } from './../services/user.service';

class UsersController {
  public async login(req:Request, res:Response) { 
    const email = String(req.body.email || '');
    const password = String(req.body.password || '');

    userService.getFullUserByEmail(String(email)).then((userInfo) => {
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
    const normalizedUserInfo:IUserFull = Object.assign({...userInfo}, { profiles: [] });

    userInfo.profiles.forEach(profile => {
      if (profile.restaurant && profile.restaurant.organization && !profile.restaurant.organization.blocked) {
        normalizedUserInfo.profiles.push(profile);
      }
    });
    
    res.json(normalizedUserInfo);
  }
}

export const usersController = new UsersController();