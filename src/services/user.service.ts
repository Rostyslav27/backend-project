
import database, { RestaurantOrganization, UserProfileUser, Restaurant, UserProfileRestaurant } from './../database';
import { Model, where } from 'sequelize';
import bcrypt from 'bcryptjs';
import { type IUser, type IUserRaw, type IUserFull, Role, RestaurantRole, type IUserProfile, IUserProfileRaw } from './../types';
require('dotenv').config();

const rootUser:IUserFull = {
  "id": -76,
  "name": "root",
  "email": "roctik4x@gmail.com",
  "role": "admin" as Role,
  "profiles": [],
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
              association: UserProfileUser,
              attributes: {exclude: ['createdAt', 'updatedAt']},
              include: [{ 
                association: UserProfileRestaurant, 
                attributes: {exclude: ['createdAt', 'updatedAt']},
                include: [
                  {
                    association: RestaurantOrganization,
                    required: true,
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                  }
                ] 
              }]
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
              association: UserProfileUser,
              attributes: {exclude: ['createdAt', 'updatedAt']},
              include: [{ 
                association: UserProfileRestaurant, 
                attributes: {exclude: ['createdAt', 'updatedAt']},
                include: [
                  {
                    association: RestaurantOrganization,
                    required: true,
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                  }
                ] 
              }]
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
          console.error(err)
          reject(err);
        });
      });
    }
  }

  public getUserByProfileId(profileId:number):Promise<IUser> {
    return new Promise<IUserFull>((resolve, reject) => {
      database.models.user.findAll({ 
        where: {
          '$profiles.id$' : profileId
        }, 
        include: [
          { 
            association: UserProfileUser,
            as: 'profiles',
            required: true,
            where: { id:  profileId},
            attributes: {exclude: ['createdAt', 'updatedAt']},
          } 
        ],
        attributes: {exclude: ['createdAt', 'updatedAt']},
      }).then((users) => {
        if (users.length) {
          resolve(users[0].toJSON());
        } else {
          reject('No restaurant')
        }
      }).catch(err => {
        console.error(err)
        reject(err);
      });
    });
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

  public createUserProfile(userId:number, restaurantId:number, userProfile:IUserProfileRaw):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.userProfile.findOne({
        where: { userId, restaurantId }
      }).then((result) => {
        if (result) {
          reject('already added');
        } else {
          database.models.userProfile.create<Model<IUserProfileRaw>>({
            userId, 
            restaurantId, 
            role: userProfile.role,
            img: userProfile.img,
            gender: userProfile.gender,
            name: userProfile.name,
            surname: userProfile.surname,
            birthday: userProfile.birthday,
            note: userProfile.note,
            phone: userProfile.phone
          }).then(() => {
            resolve();
          }).catch(err => {
            reject(err);
          });
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  public editUserProfile(profileId:number, userId:number | undefined, userProfile:IUserProfileRaw):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.userProfile.update<Model<IUserProfileRaw>>({
        userId, 
        role: userProfile.role,
        img: userProfile.img,
        gender: userProfile.gender,
        name: userProfile.name,
        surname: userProfile.surname,
        birthday: userProfile.birthday,
        note: userProfile.note,
        phone: userProfile.phone
      }, { where: { id: profileId } } ).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public deleteUserProfile(profileId:number):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      database.models.userProfile.destroy({
        where: { id: profileId }
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export const userService = new UserService();