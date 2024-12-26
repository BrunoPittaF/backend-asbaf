import { Request, Response } from 'express';
import prisma from '../db/db';
import { sendEmail } from '../utils/email';

const PartnerController = {
  async sendOrderPartner(req: Request, res: Response) {
    const { cnpj, name, cellphone, email, instagram, website, note } = req.body;

    if (!cnpj || !name || !cellphone || !email) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
    }

    try {
      const data = {
        cnpj,
        name,
        cellphone,
        email,
        instagram: instagram || '',
        website: website || '',
        note: note || ''
      }

      await sendEmail({
        from: email,
        subject: 'Pedido de parceria',
        to: process.env.EMAIL_USER || 'caiobpfigueiredo@gmail.com',
        text: `Olá, ${name}! Recebemos seu pedido de parceria. Em breve entraremos em contato para mais informações.`,
      })

      res.status(201).json({ partner: data });
    } catch (error) {
      res.status(500).json({ error: 'Error send email partner.' });
    }
  },
  async registerPartner(req: Request, res: Response) {
    const { cnpj, name, cellphone, email, instagram, website, note } = req.body;

    if (!cnpj || !name || !cellphone || !email) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
    }

    try {
      const data = await prisma.partner.create({
        data: {
          cnpj,
          name,
          cellphone,
          email,
          instagram: instagram || '',
          website: website || '',
          note: note || ''
        }
      });

      res.status(201).json({ partner: data });
    } catch (error) {
      res.status(500).json({ error: 'Error registering partner.' });
    }
  }

}

export default PartnerController;