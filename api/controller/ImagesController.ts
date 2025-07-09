import { Request, Response } from 'express';
import fs from "fs-extra";
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, "uploads");


const ImagesController = {
  async uploadImagesGallery(req: Request, res: Response) {
    try {
      const { folderName } = req.body;

      if (!folderName || !req.files) {
        res.status(400).json({ error: "Nome da pasta e imagens são obrigatórias" });
        return
      }

      // Criar diretório se não existir
      const folderPath = path.join(__dirname, '../../uploads', folderName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      (req.files as Express.Multer.File[]).forEach(file => {
        const newPath = path.join(folderPath, file.originalname);
        fs.renameSync(file.path, newPath);
      });

      res.json({ message: 'Upload realizado com sucesso!' });
      return
    } catch (error) {
      console.error("Erro ao salvar arquivos:", error);
      res.status(500).json({ error: "Erro ao salvar arquivos." });
      return
    }
  },
  async uploadImagesDirectors(req: Request, res: Response) {
    try {
      const  folderName = 'directors';

      if (!folderName || !req.files) {
        res.status(400).json({ error: "Nome da pasta e imagens são obrigatórias" });
        return
      }

      // Criar diretório se não existir
      const folderPath = path.join(__dirname, '../../uploads', folderName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      (req.files as Express.Multer.File[]).forEach(file => {
        const newPath = path.join(folderPath, file.originalname);
        fs.renameSync(file.path, newPath);
      });

      res.json({ message: 'Upload realizado com sucesso!' });
      return
    } catch (error) {
      console.error("Erro ao salvar arquivos:", error);
      res.status(500).json({ error: "Erro ao salvar arquivos." });
      return
    }
  },
  async getImagesGallery(req: Request, res: Response) {
    const uploadsPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsPath)) {
      res.json([]);
      return
    }

    const folders = fs.readdirSync(uploadsPath).map(folder => {
      const folderPath = path.join(uploadsPath, folder);
      if (fs.statSync(folderPath).isDirectory() && folder !== 'directors') {
        return {
          folder,
          images: fs.readdirSync(folderPath)
        };
      }
    }).filter(Boolean);

    res.json(folders);
    return
  },
  async getImagesDirectors(req: Request, res: Response) {
    const uploadsPath = path.join(__dirname, '../../uploads');

    const folders = fs.readdirSync(uploadsPath).map(folder => {
      const folderPath = path.join(uploadsPath, folder);
      if (folder === 'directors') {
        return fs.readdirSync(folderPath)
      }
    }).filter(Boolean);

    res.json(folders);
    return
  }
}

export default ImagesController