
import database, { RestaurantOrganization, UserProfileUser, Restaurant } from './../database';
import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { type IUser, type IUserRaw, type IUserFull, Role, RestaurantRole } from './../types';
require('dotenv').config();

const rootUser:IUserFull = {
  "id": -76,
  "name": "root",
  "email": "roctik4x@gmail.com",
  "role": "admin" as Role,
  "profiles": [],
  "restaurants": [],
  "password": "$2b$08$JfJYSnXkDwELzNeMdBo30.wGaNiPyZqEJRPLEGuILoN38PP3j7XN6"
};

export class UserService {
  public getFullUserById(id:number):Promise<IUserFull> {
    return new Promise<IUserFull>((resolve, reject) => {
      if (id === -76) {
        resolve(rootUser);
      } else {
        database.models.user.findByPk<Model<IUserFull>>(id, { 
          include: [ 
            { 
              model: Restaurant, 
              attributes: {exclude: ['createdAt', 'updatedAt', 'UserRestaurant']},
              include: [
                {
                  association: RestaurantOrganization,
                  attributes: {exclude: ['createdAt', 'updatedAt']},
                }
              ] 
            }, 
            { 
              association: UserProfileUser,
              attributes: {exclude: ['createdAt', 'updatedAt']},
            } 
          ],
          attributes: {exclude: ['createdAt', 'updatedAt']},
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

  public getFullUserByEmail(email:string):Promise<IUserFull> {
    if (email === 'root' || email === process.env.ROOT_EMAIL) {
      return this.getFullUserById(-76);
    } else {
      return new Promise<IUserFull>((resolve, reject) => {
        database.models.user.findOne({ where: { email }, 
          include: [ 
            { 
              model: Restaurant, 
              attributes: {exclude: ['createdAt', 'updatedAt']},
              include: [
                {
                  association: RestaurantOrganization,
                  attributes: {exclude: ['createdAt', 'updatedAt']},
                }
              ] 
            }, 
            { 
              association: UserProfileUser,
              attributes: {exclude: ['createdAt', 'updatedAt']},
            } 
          ],
          attributes: {exclude: ['createdAt', 'updatedAt']},
        }).then((user) => {
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

  public createUser(user:IUserRaw):Promise<IUserFull> {
    return new Promise<IUserFull>((resolve, reject) => {
      database.models.user.create<Model<IUserRaw>>({
        email: user.email,
        password: bcrypt.hashSync(user.password || '-', 7),
        name: user.name,
        surname: user.surname,
        role: user.role,
      }).then((user) => {
        if (user) {
          const rawUser:IUser = user.toJSON() as IUser;
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

  public createOrGetFullUserByEmail(user:IUserRaw):Promise<IUserFull> {
    return new Promise<IUserFull>((resolve, reject) => {
      this.getFullUserByEmail(user.email).then((user) => {
        resolve(user);
      }).catch(err => {
        this.createUser(user).then((user) => {
          this.getFullUserById(user.id).then(user => {
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