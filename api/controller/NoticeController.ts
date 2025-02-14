import { Request, Response } from 'express';
import prisma from '../db/db';


const NoticeController = {
  createNotice: async (req: Request, res: Response) => {
    const { title, content, subtitle } = req.body;
    const imagePath = req.file;

    if (!title || !content || !subtitle) {
      res.status(400).json({ error: "Todos os campos são obrigatórios." });
      return
    }

    try {
      const article = await prisma.notices.create({
        data: { title, content, subtitle, date: (String(new Date())), image: imagePath?.path || '' },
      });

      res.status(201).json({ notice: article });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar a matéria." });
      return
    }
  },
  editNotice: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, subtitle } = req.body;
    const imagePath = req.file;

    if (!title || !content || !subtitle || !id) {
      res.status(400).json({ error: "Todos os campos são obrigatórios." });
      return
    }

    try {

      const notice = await prisma.notices.findUnique({
        where: {
          id: Number(id)
        }
      })

      if (!notice) {
        res.status(404).json({ error: 'Não foi possível encontrar a matéria com esse id' })
        return
      }

      const noticeUpdated = await prisma.notices.update({
        where: {
          id: Number(id)
        },
        data: { title, content, subtitle, image: imagePath?.path || '' },
      })


      res.status(200).json({ notice: noticeUpdated })
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao editar a matéria." });
      return
    }
  },
  deleteNotice: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const noticeDeleted = await prisma.notices.delete({
        where: {
          id: Number(id)
        }
      })

      if (!noticeDeleted) {
        res.status(400).json({ error: "Não foi possivel encontrar a noticia relatada" });
        return
      }


      res.status(200).json({ message: 'Noticia deletada com sucesso' })
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar a matéria." });
    }
  },
  getNotice: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const notice = await prisma.notices.findUnique({
        where: {
          id: Number(id)
        }
      });

      if (!notice) {
        res.status(404).json({ error: 'Não foi possível encontrar a matéria com esse id' })
        return
      }

      res.status(200).json({ notice: notice })
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar a matéria." });
    }
  },
  listNotice: async (req: Request, res: Response) => {
    const notices = await prisma.notices.findMany();

    res.status(200).json({ notices })
  }

}

export default NoticeController




