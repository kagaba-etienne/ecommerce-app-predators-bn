import { Router } from 'express';
import passport from 'passport';
import Jwt from '../utils/jwt';
import { googlePass } from '../utils/passport';
import profileController from '../controller/profileController';
// Google route

import {
  googleAuthHandler,
  GetUsers,
  GetUserById,
  DeleteUserById,
  logout,
  disableUser,
  register,
  UserLogin,

  requestResetPassword,resetPassword,
  resetPasswordLink,
} from "../controller/authController";




import {
  isAdmin,
  isSeller,
  isBuyer,
  checkPermission,
} from '../middleware/roles';
import { setRole } from '../services/role.services';

const router = Router();
// Google routes
googlePass();

router.get('/callback', (req, res) => {
  if (req.query.key) {
    const user = Jwt.verifyToken(req.query.key);
    return res.status(200).json({
      message: 'Thanks for logging in',
      user,
      token: req.query.key,
    });
  }
  return res.status(401).json({ error: 'Unauthorized' });
});
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/',
  }),
  googleAuthHandler,
);
router.post('/logout', logout);
router.get('/users', isAdmin, GetUsers);
router.get('/users/:id', isAdmin, GetUserById);
router.delete('/users/:id', isAdmin, DeleteUserById);
router.post('/setRole', isAdmin, setRole);
router.post('/disableUser', isAdmin, disableUser);
router.post('/login', UserLogin);
router.post('/register', register);
router.patch('/users/profiles', profileController.updateUserProfile);
export default router;
