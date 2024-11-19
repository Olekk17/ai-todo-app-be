import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { DecodedToken } from "../types";

export const auth = (req: Request & any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if ((decodedData.exp || 0) * 1000 < Date.now() || !decodedData.id) {
      return res.status(401).send('Session Expired');
    }
    req.userId = decodedData.id;
  } catch (err) {
    console.log(err);
    return res.status(401).send('Invalid Token');
  }

  return next();
}