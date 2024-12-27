import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db/db';
import jwt from 'jsonwebtoken';
import { IRelativesBD } from '../types';
const jwtSecret = process.env.JWT_SECRET || 'asuhd192and!aiusyd381a8sd67';

function generateToken(userId: number) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
}

const translatePositionRelative = {
  2: '10',
  3: '20',
  4: '21',
  5: '22',
  6: '23',
  7: '24',
}

const UserController = {
  registerUser: async (req: Request, res: Response) => {
    const { name, email, password, address, birthDate, cpf, cellphone, cellMobile, cellSefaz, sectorSefaz, instagram, threads, facebook, relatives } = req.body;

    let relativesBD: any = [];

    if (!name || !email || !password || !address || !birthDate || !cpf || !cellphone || !cellMobile) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
    }

    const numberAssociated = cpf + '00';

    relatives && relatives.length > 0 && relatives.forEach((relative: IRelativesBD) => {
      relative.numberAssociated = relative.cpf + translatePositionRelative[relative.position as keyof typeof translatePositionRelative];
      relative.userCpf = cpf;
    })

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          address,
          email,
          password: hashedPassword,
          cpf,
          birthDate: String(new Date(birthDate)),
          cellphone: cellphone,
          cellMobile: cellMobile,
          numberAssociated: numberAssociated,
          cellSefaz: cellSefaz || '',
          sectorSefaz: sectorSefaz || '',
          instagram: instagram || '',
          threads: threads || '',
          facebook: facebook || '',
        },
      });

      if (relatives) {
        relativesBD = await prisma.relatives.create({
          data: relatives
        })
      }

      res.status(201).json({ user: user, relatives: relativesBD });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error registering user.' });
    }
  },
  getOneUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { cpf } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      const relatives = await prisma.relatives.findMany({ where: { userCpf: cpf } });

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return
      }

      const { password, ...userWithouPassword } = user;

      res.status(200).json({ user: userWithouPassword, relatives });
    } catch (error) {
      res.status(500).json({ error: 'Error getting user.' });
    }
  },
  login: async (req: Request, res: Response) => {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      res.status(400).json({ error: 'cpf and password are required.' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { cpf } });

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user!.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = generateToken(user!.id);

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in.' });
    }
  },
  editUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, address, birthDate, cpf, cellphone, cellMobile, cellSefaz, sectorSefaz, instagram, threads, facebook, relatives } = req.body;

    let relativeList: IRelativesBD[] = [];
    if (!name || !email || !password || !address || !birthDate || !cpf || !cellphone || !cellMobile) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          name,
          address,
          email,
          cpf,
          birthDate: String(new Date(birthDate)),
          cellphone: cellphone,
          cellMobile: cellMobile,
          cellSefaz: cellSefaz || '',
          sectorSefaz: sectorSefaz || '',
          instagram: instagram || '',
          threads: threads || '',
          facebook: facebook || '',
        },
      })

      if (!updatedUser) res.status(404).json({ error: 'User not found' });


      if (relatives) {
        relatives.forEach(async (relative: IRelativesBD) => {
          relative.numberAssociated = relative.cpf + translatePositionRelative[relative.position as keyof typeof translatePositionRelative];
          const updatedRelatives = await prisma.relatives.update({
            where: {
              userCpf: cpf,
              cpf: relative.cpf
            },
            data: {
              userCpf: cpf,
              cpf: relative.cpf,
              name: relative.name,
              numberAssociated: relative.numberAssociated,
              position: relative.position,
            }
          })

          relativeList.push(updatedRelatives);

        })
      }

      res.status(200).json({ user: updatedUser, relatives: relativeList });


    } catch (error) {
      res.status(500).json({ error: 'Error update user' });
    }

  }
}

export default UserController




