import { Request, Response } from 'express';
import prisma from '../db/db';

const InstagramController = {
  async createLink(req: Request, res: Response) {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: 'Missing data' });
      return
    }

    try {
      const data = await prisma.instagramURL.create({
        data: {
          url
        }
      });

      res.status(201).json({ instagram: data });
      return

    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar instagram' });
      return
    }
  },
  async getLink(req: Request, res: Response) {
    try {
      const data = await prisma.instagramURL.findMany();

      res.status(200).json({ instagram: data });
      return

    } catch (error) {
      res.status(500).json({ error: 'Error getting instagram' });
      return
    }
  }
}

export default InstagramController;