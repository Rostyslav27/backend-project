import { type IUser, type IUserRaw, Role } from './../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userService } from './../services/user.service';
require('dotenv').config();

const jwtKey:string = process.env.JWT_KEY || 'rvdfnobufig5';

export class User {
  private _user: IUser;

  constructor(user:IUser) {
    this._user = user;
  }

  public getInfo():IUser {
    return Object.assign({...this._user}, { password: '*' });
  }

  public getId():number {
    return this._user.id;
  }

  hasPermisson(roles:Role[]):boolean {
    return roles.length ? roles.includes(this._user.role) : true;
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