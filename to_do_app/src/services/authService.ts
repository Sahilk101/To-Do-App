import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (fullName: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword
    }
  });

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { user, accessToken, refreshToken };
};

export const validatePassword = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
};

export const generateToken = (user: { id: string}) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
