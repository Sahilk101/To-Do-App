import { Request, Response } from 'express';
import { registerUser, validatePassword, generateToken, generateRefreshToken } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const user = await registerUser(fullName, email, password);
  res.status(201).json(user);
  console.log(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await validatePassword(email, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user)
  const refreshToken = generateRefreshToken(user.id)
  const response = {
    message: 'Login successful',
    data : {
      token,
      refreshToken
    }
  }
  res.json(response);
};
