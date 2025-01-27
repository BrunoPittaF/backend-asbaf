import jsonwebtoken from 'jsonwebtoken';
import { Request, Response } from 'express';


declare module 'express' {
  interface Request {
    headers: {
      authorization?: string
    }
  }
}

export function verifyToken(req: Request, res: Response, next: (err?: any) => void) {
  const token = req.headers.authorization;


  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET!, (err) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }
      next();
    });
  } else {
    res.status(403).json({ message: 'Token não fornecido' });
  }
}