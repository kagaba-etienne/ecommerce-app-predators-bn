import { Router } from 'express';
import jsend from 'jsend';
import { addProduct, showCatalogue } from '../controller/prodController.js';
import { isSeller } from '../middleware/roles.js';
import db from '../database/models/index.js';

const router = Router();

router.param('userId', async (req, res, next, id) => {
  // try to get the user details from the User model and attach it to the request object
  const user = await db.User.findOne({ where: { id, roleId: 1 } });
  if (user) {
    console.log('found the seller');
    req.user = user; // assign the user to the request object
    next(); // and pass it to the next middleware/routes/callable, if any. e.g.: req.params.userId
  } else {
    console.log('seller not found');
    res.status(400).json(jsend.fail({ message: 'user not found😥' }));
  }
});

router.post('/new', isSeller, addProduct);
router.get('/available/:userId', showCatalogue);

export default router;