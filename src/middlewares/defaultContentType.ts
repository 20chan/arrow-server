import { Request, Response, NextFunction } from "express";

export const defaultContentTypeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
};