import express from 'express';
import authRoute from './authRoutes';
import projectRoute from './projectRoute';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/project',
    route: projectRoute
  },
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;