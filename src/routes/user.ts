import express from 'express';
import UserController from '../controller/UserController';

const router = express.Router();

router.post('/create', UserController.registerUser);
router.get('/login', UserController.login);


export default router;