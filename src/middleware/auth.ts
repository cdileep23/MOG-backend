import { NextFunction, Request, Response } from "express";

export const isAdmin = (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction
): any=> {
  if (req.body.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" }); 
  }
  next();
};
