import { type IUserFull, type IUserRaw, Role, RestaurantRole, type IUserProfile, type IUser } from './../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userService } from './../services/user.service';
require('dotenv').config();

const jwtKey:string = process.env.JWT_KEY || 'rvdfnobufig5';

export class User {
  private _user: IUserFull;

  constructor(user:IUserFull) {
    this._user = user;
  }

  public getInfo():IUserFull {
    return Object.assign({...this._user}, { password: '*' });
  }

  public static userToFullUser(user:IUser):IUserFull {
    return Object.assign(user, { profiles: [] });
  }

  public getProfile(restaurantId:number):IUserProfile | undefined {
    const userProfile:IUserProfile | undefined = this._user.profiles.find(profile => profile.restaurant && profile.restaurant.id === restaurantId);
    const user:IUser = {...this.getInfo()} as IUser;

    delete user.profiles;
    delete userProfile?.restaurant

    return userProfile ? Object.assign(userProfile, { user }) satisfies IUserProfile : undefined;
  }

  public getId():number {
    return this._user.id;
  }

  hasPermisson(roles:Role[]):boolean {
    return roles.length ? roles.includes(this._user.role) : true;
  }

  hasRestaurantPermisson(roles:RestaurantRole[], restaurantId:number):boolean {
    const profileIndex = this._user.profiles.findIndex(profile => profile.restaurantId && profile.restaurantId === restaurantId);
    if (profileIndex > -1) {
      return roles.length ? roles.includes(this._user.profiles[profileIndex].role) : true;
    } else {
      return false;
    }
  }

  public getToken(password:string, remember?:boolean):string {
    if (this._user.password && bcrypt.compareSync(password, this._user.password)) {
      return jwt.sign({id: this._user.id}, jwtKey, {expiresIn: remember ? '90d' : '2d'});
    } else {
      return '';
    }
  }

  public sync():Promise<IUserFull> {
    return new Promise((resolve, reject) => {
      userService.getFullUserById(this._user.id).then((userInfo) => {
        this._user = userInfo;
        resolve(this.getInfo());
      }).catch(err => {
        reject(err);
      })
    });
  }

  public static hashPassword(user:IUserRaw):IUserRaw {
    return Object.assign({...user}, { password: bcrypt.hashSync(user.password || '-', 7) });
  }

  public edit(user:IUserRaw):Promise<void> {
    return userService.editUser(this._user.id, user);
  }
}