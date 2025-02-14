import express from 'express';
import NoticeController from '../controller/NoticeController';

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

router.post('/', upload.single('image'), NoticeController.createNotice);
router.put('/:id', upload.single('image'), NoticeController.editNotice);
router.delete('/:id', NoticeController.deleteNotice);
router.get('/:id', NoticeController.getNotice);
router.get('/', NoticeController.listNotice)



export default router;