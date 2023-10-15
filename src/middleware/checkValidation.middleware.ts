require('dotenv').config(); 
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/src/validation-result';
import { Errors } from '../types';

export const checkValidation = (req:Request, res:Response, next:NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(Errors.InvalidRequest);
    } else {
      next();
    }
  } catch(err:any) {
    res.status(500).json(Errors.Unknown);
  }
}
