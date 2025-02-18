import express from 'express';
import PartnerController from '../controller/PartnerController';

const router = express.Router();

router.post('/sendOrder', PartnerController.sendOrderPartner);
router.put('/register/:id', PartnerController.registerPartner);
router.get('/list', PartnerController.listPartners);
router.put('/register/edit/:id', PartnerController.editPartner);
router.put('/register/remove/:id', PartnerController.deletePartner);



export default router;