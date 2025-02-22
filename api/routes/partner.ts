import express from 'express';
import PartnerController from '../controller/PartnerController';

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Gera um nome único
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/sendOrder', PartnerController.sendOrderPartner);
router.put('/register/:id', upload.single('image'), PartnerController.registerPartner);
router.get('/list', PartnerController.listPartners);
router.put('/register/edit/:id', upload.single('image'), PartnerController.editPartner);
router.put('/register/remove/:id', PartnerController.deletePartner);
router.post('/register', upload.single('image'), PartnerController.addPartner);



export default router;