
require('dotenv').config(); 

import { type Request, type Response } from 'express';
import { Errors, RestaurantRole, Role } from '../types';
import { reservationService } from './../services/reservation.service';
import { clientService } from './../services/client.service';
import { userService } from './../services/user.service';
import { Restaurant } from './../models/restaurant.model';
import { User } from './../models/user.model';

class ProfilesController {

  public async editProfile(req:Request, res:Response) {
    const restaurant:Restaurant = req.body.reqRestaurant;
    const profileId:number = +req.params.id;
    const email:string = String(req.body.email || '');
    const role:RestaurantRole = String(req.body.role || '') as RestaurantRole;
    const name:string | undefined = String(req.body.name || '') || undefined;
    const surname:string | undefined = String(req.body.surname || '') || undefined;
    const phone:string | undefined = String(req.body.phone || '') || undefined;
    const birthday:string | undefined = String(req.body.birthday || '') || undefined;
    const gender:string | undefined = String(req.body.gender || '') || undefined;
    const note:string | undefined = String(req.body.note || '') || undefined;
    let user:User;

    const promiseList:Promise<any>[] = [];

    if (email) {
      promiseList.push(userService.createOrGetFullUserByEmail({ email, role: Role.User, password: String(Math.random()) }).then((userInfo) => {
        user = new User(userInfo);
      }).catch((err) => {
        console.error(err);
      }))
    } else {
      promiseList.push(userService.getUserByProfileId(profileId).then((userInfo) => {
        user = new User(User.userToFullUser(userInfo));
      }).catch((err) => {
        console.error(err);
      }))
    }

    Promise.all(promiseList).then(() => {
      restaurant.editProfile(profileId, user.getId(), {
        role, name, surname, phone, birthday, gender, note
      }).then(() => {
        user.sync().then(() => {
          res.json(user.getProfile(restaurant.getId()));
        }).catch(err => {
          res.status(500).json(Errors.Unknown);
        });
      }).catch(err => {
        res.status(400).json(Errors.NotExist);
      });
    }).catch((err) => {
      res.status(500).json(Errors.Unknown);
    });
  }

  public async deleteProfile(req:Request, res:Response) {
    const restaurant:Restaurant = req.body.reqRestaurant;
    const profileId = +req.params.id;

    console.log(restaurant.getInfo())

    restaurant.removeProfile(profileId).then(() => {
      res.json('success');
    }).catch(err => {
      res.status(500).json(Errors.Unknown);
    })
  }
}

export const profilesController = new ProfilesController();