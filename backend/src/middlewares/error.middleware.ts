import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError | Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientInitializationError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ── Prisma Known Request Errors ───────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const field = (err.meta?.target as string[])?.join(', ') ?? 'field';
        res.status(409).json({ error: `A record with this ${field} already exists.` });
        return;
      }
      case 'P2025':
        // Record not found
        res.status(404).json({ error: 'Record not found.' });
        return;
      case 'P2003':
        // Foreign key constraint
        res.status(400).json({ error: 'Related record not found.' });
        return;
      case 'P2014':
        // Required relation violation
        res.status(400).json({ error: 'Invalid relation in request.' });
        return;
      default:
        console.error(`[Prisma Error ${err.code}] ${req.method} ${req.path}:`, err.message);
        res.status(500).json({ error: 'Database error. Please try again.' });
        return;
    }
  }

  // ── Prisma Connection / Initialization Errors ─────────────────────────────────
  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error('[Prisma Init Error]', err.message);
    res.status(503).json({ error: 'Database connection failed. Please try again later.' });
    return;
  }

  // ── Prisma Validation Errors ──────────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error('[Prisma Validation]', err.message);
    res.status(400).json({ error: 'Invalid data provided.' });
    return;
  }

  // ── App Errors (createError) ──────────────────────────────────────────────────
  const appErr = err as AppError;
  const statusCode = appErr.statusCode || 500;
  const message = appErr.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  }

  const responseMessage =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again later.'
      : message;

  res.status(statusCode).json({
    error: responseMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: appErr.stack }),
  });
}

export function createError(message: string, statusCode: number): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}
