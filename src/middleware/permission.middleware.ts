require('dotenv').config(); 

// types
import { Errors } from './../types';
import { Request, Response, NextFunction } from 'express';

// objects 
import jwt from 'jsonwebtoken';
import { userService } from './../services/user.service';
import { Role } from './../types';
import { User } from 'models/user.model';

const jwtKey:string = process.env.JWT_KEY || 'rvdfnobufig5';

export const permissionMiddleware = (roles:Role[], options:{self?:boolean, authorization?:boolean} = {authorization: true}) => {
  return async function(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      if (options.authorization || options.self) {
        if (req.headers.authorization) {
          const token:string = req.headers.authorization.split(' ')[1];
          
          if (!token || typeof token != 'string') {
            res.status(403).json(Errors.NotAuthorized);
          } else {
            const userInfo = jwt.verify(token, jwtKey);

            if (typeof userInfo != 'string' && !!userInfo.id) {
              userService.getUserById(+userInfo.id).then((userInfo) => {
                const user = new User(userInfo);
                let havePermission:boolean = user.hasPermisson(roles);
                let selfPermission:boolean = !!(options.self && req.body.id === user.getId());
                
                if (havePermission || selfPermission) {
                  req.body.reqUser = user;
                  req.body.havePermission = havePermission;
                  req.body.selfPermission = selfPermission;
                  next();
                } else {
                  res.status(400).json(Errors.PermissionDenied);
                }
              }).catch((err) => {
                res.status(400).json(Errors.NotAuthorized);
              });
                
            } else {
              res.status(400).json(Errors.InvalidRequest);
            }
          }
        } else {
          res.status(403).json(Errors.NotAuthorized);
        }
      } else {
        next();
      }
    } catch(err:any) {
      res.status(403).json(Errors.Unknown);
    }
  }
}
