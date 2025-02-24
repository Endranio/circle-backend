import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export function initCloudinary(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cloud_name = process.env.CLOUD_NAME || '';
  const api_key = process.env.API_NAME || '';
  const api_secret = process.env.API_SECRET || '';
  // Configuration
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
  next();
}
