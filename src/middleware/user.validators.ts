import { Request, Response, NextFunction } from 'express';
import db from '../db';

// Middleware function to validate user input
export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;

  // Check if name and email are present
  if (!name || !email) {
    res.status(400).json({ message: 'Name and email are required' });
    return;
  }

  // Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  // Move to the next middleware function if validation passes
  next();
};

// Middleware function to validate email uniqueness
export const validateEmailUniqueness = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    // Check if email already exists, excluding the current user
    let result;
    if (req.params.id) {
      result = await db.query('SELECT * FROM USERS WHERE email = $1 AND id <> $2', [email, req.params.id]);
    } else {
      result = await db.query('SELECT * FROM USERS WHERE email = $1', [email]);
    }
    console.log(result);
    if (result.length > 0) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }
  } catch (error) {
    console.error('Error querying database', error);
    res.status(500).json({ message: 'Email must be unique' });
    return;
  }

  // Move to the next middleware function if validation passes
  next();
};
