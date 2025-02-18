import { Request, Response } from 'express';
import prisma from '../db/db';
import { sendEmail } from '../utils/email';

const PartnerController = {
  async sendOrderPartner(req: Request, res: Response) {
    const { cnpj, name, cellphone, email, instagram, website, note } = req.body;

    if (!cnpj || !name || !cellphone || !email) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
      return
    }

    try {
      const data = {
        cnpj,
        name,
        cellphone,
        email,
        instagram: instagram || '',
        website: website || '',
        note: note || '',
        isPartner: false
      }

      // await sendEmail({
      //   from: process.env.MAIL_USERNAME || 'asbaf94@gmail.com',
      //   subject: 'Pedido de parceria',
      //   to: email,
      //   text: `Olá, ${name}! Recebemos seu pedido de parceria. Em breve entraremos em contato para mais informações.`,
      // })

      // await sendEmail({
      //   from: email,
      //   subject: 'Pedido de parceria',
      //   to: process.env.MAIL_USERNAME || 'asbaf94@gmail.com',
      //   text: note || 'Sem mais informações adicionadas no email'
      // })

      const partner = await prisma.partner.create({
        data: data
      })


      res.status(201).json({ partner: partner });
      return
    } catch (error) {
      res.status(500).json({ error: 'Error send email partner.' });
      return
    }
  },
  async listPartners(req: Request, res: Response) {
    const partners = await prisma.partner.findMany();

    res.status(200).json({ partners });
    return
  },
  async registerPartner(req: Request, res: Response) {
    const { cnpj, name, cellphone, email, instagram, website, note } = req.body;
    const { id } = req.params;

    if (!id || !cnpj || !name || !cellphone || !email) {
      res.status(400).json({ error: 'Faltam dados o suficiente' });
      return
    }

    const data = {
      cnpj,
      name,
      cellphone,
      email,
      instagram: instagram || '',
      website: website || '',
      note: note || '',
      isPartner: true
    }

    try {
      const findedPartner = await prisma.partner.update({
        where: {
          id: Number(id)
        },
        data: data
      })

      res.status(201).json({ partner: findedPartner });
      return
    } catch (error) {
      res.status(500).json({ error: 'Error registering partner.' });
      return
    }
  },
  async editPartner(req: Request, res: Response) {
    const { cnpj, name, cellphone, email, instagram, website, note, isPartner } = req.body;
    const { id } = req.params;

    if (!id || !cnpj || !name || !cellphone || !email || !isPartner) {
      res.status(400).json({ error: 'Faltam dados o suficiente' });
      return
    }

    const data = {
      cnpj,
      name,
      cellphone,
      email,
      instagram: instagram || '',
      website: website || '',
      note: note || '',
      isPartner
    }

    try {
      const findedPartner = await prisma.partner.update({
        where: {
          id: Number(id)
        },
        data: data
      })

      res.status(201).json({ partner: findedPartner });
      return
    } catch (error) {
      res.status(500).json({ error: 'Error registering partner.' });
      return
    }
  },
  async deletePartner(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const partnerDeleted = await prisma.partner.update({
        where: {
          id: Number(id)
        },
        data: {
          isPartner: false
        }
      })

      if (!partnerDeleted) {
        res.status(404).json({ error: 'Não foi possível encontrar o parceiro com esse id' });
        return
      }

      res.status(200).json({ partner: partnerDeleted });
      return
    } catch (error) {
      res.status(500).json({ error: 'Error deleting partner.' });
      return
    }
  }

}

export default PartnerController;