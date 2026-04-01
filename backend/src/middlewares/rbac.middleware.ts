import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: `Access denied. Requires role: ${roles.join(' or ')}` });
      return;
    }
    next();
  };
}

export const requireAdmin = requireRole('ADMIN');
export const requireAdminOrEditor = requireRole('ADMIN', 'EDITOR');
