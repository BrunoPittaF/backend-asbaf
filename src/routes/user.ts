import express from 'express';
import UserController from '../controller/UserController';
import { verifyToken } from '../middlewares/token';

const router = express.Router();

router.post('/create', UserController.registerUser);
router.get('/login', UserController.login);
router.get('/:id', verifyToken, UserController.getOneUser)


export default router;