
import database, { RestaurantOrganization, RestaurantUser, UserProfileUser, RestaurantRoom, RoomTable } from './../database';
import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { type IUser, type IUserRaw, type IUserExact, Role, RestaurantRole } from './../types';
require('dotenv').config();

const rootUser:IUser = {
  "id": -76,
  "name": "root",
  "email": "roctik4x@gmail.com",
  "role": "admin" as Role,
  "profiles": [],
  "restaurants": [],
  "password": "$2b$08$JfJYSnXkDwELzNeMdBo30.wGaNiPyZqEJRPLEGuILoN38PP3j7XN6"
};

export class UserService {
  public getUserById(id:number):Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      if (id === -76) {
        resolve(rootUser);
      } else {
        database.models.user.findByPk(id, { 
          include: [ 
            { 
              association: RestaurantUser, 
              include: [
                RestaurantOrganization, 
                { 
                  association: RestaurantRoom, 
                  include: [RoomTable] 
                }
              ] 
            }, 
            { 
              association: UserProfileUser 
            } 
          ] 
        }).then((user) => {
          if (user) {
            resolve(user.toJSON());
          } else {
            reject('user not found');
          }
        }).catch(err => {
          reject(err);
        });
      }
    });
  }

  public getUserByEmail(email:string):Promise<IUser> {
    if (email === 'root' || email === process.env.ROOT_EMAIL) {
      return this.getUserById(-76);
    } else {
      return new Promise<IUser>((resolve, reject) => {
        database.models.user.findOne({ where: { email }, include: [ { association: RestaurantUser, include: [{ association: RestaurantOrganization, include: [RoomTable] }] }, { association: UserProfileUser } ] }).then((user) => {
          if (user) {
            resolve(user.toJSON());
          } else {
            reject('user not found');
          }
        }).catch(err => {
          reject(err);
        });
      });
    }
  }

  public createUser(user:IUserRaw):Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      database.models.user.create<Model<IUserRaw>>({
        email: user.email,
        password: bcrypt.hashSync(user.password, 7),
        name: user.name,
        surname: user.surname,
        role: user.role,
      }).then((user) => {
        if (user) {
          const rawUser:IUserExact = user.toJSON() as IUserExact;
          resolve(Object.assign(rawUser, { restaurants: [], profiles: [] }));
        } else {
          reject('User was not created')
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public editUser(id:number, user:IUserRaw):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.user.update<Model<IUserRaw>>({
        name: user.name,
        surname: user.surname,
        role: user.role,
      }, { where: { id } }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public createOrGetUserByEmail(user:IUserRaw):Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      this.getUserByEmail(user.email).then((user) => {
        resolve(user);
      }).catch(err => {
        this.createUser(user).then((user) => {
          this.getUserById(user.id).then(user => {
            resolve(user);
          }).catch(err => {
            reject(err);
          })
        }).catch(err => {
          reject(err);
        })
      })
    });
  }

  public addUserToRestaurant(userId:number, restaurantId:number, userRole:RestaurantRole):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        database.models.userProfile.create({userId, restaurantId, role: userRole}),
        database.models.UserRestaurant.create({userId, restaurantId})
      ]).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const userService = new UserService();