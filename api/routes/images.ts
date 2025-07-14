import express from 'express';
import ImagesController from '../controller/ImagesController';

import multer from 'multer';

const upload = multer({ dest: '../../uploads/' });

const router = express.Router();

router.post('/gallery', upload.array('images'), ImagesController.uploadImagesGallery);
router.post('/directors', upload.array('images'), ImagesController.uploadImagesDirectors);
router.get('/gallery', ImagesController.getImagesGallery);
router.get('/directors', ImagesController.getImagesDirectors);




export default router;