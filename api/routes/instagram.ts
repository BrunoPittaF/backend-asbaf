import express from 'express';
import InstagramController from '../controller/InstagramController';


const router = express.Router();

router.post('/create', InstagramController.createLink);
router.get('/list', InstagramController.getLink);

export default router;