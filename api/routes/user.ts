import express from 'express';
import UserController from '../controller/UserController';
import { verifyToken } from '../middlewares/token';
import multer from 'multer';
import path from 'path';

// Configuração do multer para salvar imagens em uma pasta "uploads"
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

router.get('/list', UserController.listUsers);
router.post('/create', upload.single('image'), UserController.registerUser);
router.post('/login', UserController.login);
router.get('/:id', verifyToken, UserController.getOneUser)
router.put('/edit/:id', verifyToken, UserController.editUser)


export default router;