
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import passportJWT, { StrategyOptions } from 'passport-jwt';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { PrismaClient } from '@prisma/client';
import { any } from 'joi';

const prisma = new PrismaClient();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload:any, done:any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: jwtPayload.id } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

const auth = () => (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err:any, user:any) => {
    if (err || !user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default auth;
