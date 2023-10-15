
// types
import { Request, Response } from 'express';
import { Errors } from '../types';

// objects 

export const tryTo = (func:Function, name:string = 'unknown') => {
  return (req:Request, res:Response):void => {
    try { 
      func(req, res);
    } catch(err:any) {
      res.status(500).json(Errors.Unknown);
    }
  }
}