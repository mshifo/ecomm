import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the request body type
type AuthRequestBody = {
  email: string;
  password: string;
  username?: string;
  name?: string;
};

// Define the login request schema
export const loginRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Define the register request schema
export const registerRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  name: Joi.string().required(),
});

export function validate(schema: Joi.ObjectSchema) {
  return async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
