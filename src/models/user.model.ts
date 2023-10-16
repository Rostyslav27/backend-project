import { type IUserFull, type IUserRaw, Role, RestaurantRole } from './../types';
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
    if (bcrypt.compareSync(password, this._user.password)) {
      return jwt.sign({id: this._user.id}, jwtKey, {expiresIn: remember ? '90d' : '2d'});
    } else {
      return '';
    }
  }

  public static hashPassword(user:IUserRaw):IUserRaw {
    return Object.assign({...user}, { password: bcrypt.hashSync(user.password, 7) });
  }

  public edit(user:IUserRaw):Promise<void> {
    return userService.editUser(this._user.id, user);
  }
}