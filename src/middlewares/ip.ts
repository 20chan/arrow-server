import { Request, Response, NextFunction } from "express";

export const getIp = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers["x-forwarded-for"] as string;
    req.realIp = ip;
    next();
};