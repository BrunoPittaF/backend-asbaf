import express from 'express';
import PartnerController from '../controller/PartnerController';

const router = express.Router();

router.post('/sendOrder', PartnerController.sendOrderPartner);
router.post('/register', PartnerController.registerPartner);



export default router;