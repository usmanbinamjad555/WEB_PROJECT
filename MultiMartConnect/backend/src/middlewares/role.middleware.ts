import { Request, Response, NextFunction } from 'express';

export function authorizeRoles(...allowedRoles: Array<'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication processing required prior to attempting downstream access.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role as any)) {
      res.status(403).json({ error: 'Access denied: Identity privileges do not meet execution matrix parameters.' });
      return;
    }

    next();
  };
}