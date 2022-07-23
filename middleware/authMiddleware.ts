import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

export async function protect(req: any, res: Response, next: NextFunction) {
    if (!req.headers.authorization?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    if (process.env.JWT_SECRET == null) {
        return res.status(500);
    }

    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);

    const userId = jwt.decode(token) as JwtPayload;
    if (userId == null || !('id' in userId)) return res.status(500);
    const user = await User.findOne({ _id: userId.id });

    if (user == null) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    req.id = user._id;
    next();
}
