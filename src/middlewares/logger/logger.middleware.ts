import { Request, Response } from "express";

export function LoggerMiddleware(req:Request, res:Response, next: Function){
  console.log(`Incoming Request: ${req.method}, ${req.originalUrl}`);
  next();
}