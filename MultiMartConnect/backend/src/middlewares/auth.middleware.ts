import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenStructure {
  userId: string;
  tenantId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER';
}

export function authenticatingPipeline(req: Request, res: Response, next: NextFunction): void {
  const directHeader = req.headers.authorization;
  if (!directHeader || !directHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header format syntax is invalid or completely missing.' });
    return;
  }

  const tokenValue = directHeader.split(' ')[1];
  try {
    const verified = jwt.verify(tokenValue, process.env.JWT_ACCESS_SECRET || 'secret') as TokenStructure;
    
    if ((req as any).tenantId && (req as any).tenantId !== verified.tenantId) {
       res.status(403).json({ error: 'Identity containment context cross-tenant bound operations are explicitly banned.' });
       return;
    }

    (req as any).user = {
      id: verified.userId,
      email: verified.email,
      role: verified.role as any
    };
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Provided access payload signing signature is expired or unauthenticated.' });
  }
}