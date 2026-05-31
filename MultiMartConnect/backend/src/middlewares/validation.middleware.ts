import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validatePayload(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
         res.status(400).json({
          error: 'Input verification syntax structural failures detected.',
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
         return;
      }
      res.status(500).json({ error: 'Internal input serialization processing error.' });
    }
  };
}