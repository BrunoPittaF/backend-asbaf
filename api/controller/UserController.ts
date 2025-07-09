import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../db/db';
import jwt from 'jsonwebtoken';
import { IRelativesBD } from '../types';
import { sendEmail } from '../utils/email';
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
    const imagePath = req.file;

    if (!name || !email || !password || !address || !birthDate || !cpf || !cellphone || !cellMobile || !imagePath) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
      return
    }

    const numberAssociated = cpf + '00';
    let localRelatives = JSON.parse(relatives);

    localRelatives && localRelatives.length > 0 && localRelatives.forEach((relative: IRelativesBD) => {
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
          Image: imagePath.path
        },
      });

      let relativesBD: any = [];
      if (localRelatives && localRelatives.length > 0) {
        relativesBD = await Promise.all(
          localRelatives.map((relative: IRelativesBD) =>
            prisma.relatives.create({
              data: relative,
            })
          )
        );
      }

      const responseUser = {
        id: user.id,
        name: user.name,
        address: user.address,
        email: user.email,
        cpf: user.cpf,
        birthDate: user.birthDate,
        cellphone: user.cellphone,
        cellMobile: user.cellMobile,
        numberAssociated: user.numberAssociated,
        cellSefaz: user.cellSefaz || '',
        sectorSefaz: user.sectorSefaz || '',
        instagram: user.instagram || '',
        threads: user.threads || '',
        facebook: user.facebook || '',
        Image: user.Image
      }

      await sendEmail({
        from: email,
        subject: 'Novo Associado!',
        to: process.env.MAIL_USERNAME || 'asbaf94@gmail.com',
        // to: 'caiobrunopittaf@gmail.com',
        text: '',
        html: `<h1>Olá, estou me associando a ASBAF! Segue os dados que acabei de enviar pelo website: </h1> 
        <img src=${'https://backend-asbaf.vercel.app/' + user.Image} />
        <p>Nome: ${user.name} </p>
        <p>Endereço: ${user.address} </p>
        <p>CPF: ${user.cpf} </p>
        <p>Data de nascimento: ${user.birthDate} </p>
        <p>Telefone: ${user.cellphone} </p>
        <p>Celular: ${user.cellMobile} </p>
        <p>Número de associado: ${user.numberAssociated} </p>
        <p>Celular Sefaz: ${user.cellSefaz || ''} </p>
        <p>Setor Sefaz: ${user.sectorSefaz || ''} </p>
        <p>Setor Sefaz: ${user.sectorSefaz || ''} </p>
        <p>Instagram: ${user.instagram || ''} </p>
        <p>Threads: ${user.threads || ''} </p>
        <p>Facebook: ${user.facebook || ''} </p>
        `,
      })

      await sendEmail({
        from: email,
        subject: 'Cadastro efetuado com sucesso!',
        to: process.env.MAIL_USERNAME || 'asbaf94@gmail.com',
        // to: 'caiobrunopittaf@gmail.com',
        text: 'Seja bem vindo a ASBAF!'
      })

      res.status(201).json({ user: responseUser, relatives: relativesBD || [] });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error registering user.' });
      return
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
  listUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      const relatives = await prisma.relatives.findMany();

      users ? res.status(200).json({ users: users, relatives: relatives }) : res.status(200).json({ users: [] });
    } catch (error) {
      res.status(500).json({ error: 'Error getting users.' });
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
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user!.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = generateToken(user!.id);

      console.log('login efetuado');

      const { password: userPassword, ...userWithoutPassword } = user;


      res.status(200).json({ token, user: userWithoutPassword });
      return;
    } catch (error) {
      console.log('login error');

      res.status(500).json({ error: 'Error logging in.' });
    }
  },
  editUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, address, birthDate, cpf, cellphone, cellMobile, cellSefaz, sectorSefaz, instagram, threads, facebook, relatives } = req.body;
    const imagePath = req.file;

    let relativeList: IRelativesBD[] = [];
    if (!name || !email || !password || !address || !birthDate || !cpf || !cellphone || !cellMobile) {
      res.status(400).json({ error: 'Dados obrigatórios estão faltando no formulário' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          name,
          address,
          password: hashedPassword,
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
          Image: imagePath?.path || '',
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

      const userWithoutPassword = { ...updatedUser, password: undefined };

      res.status(200).json({ user: userWithoutPassword, relatives: relativeList });


    } catch (error) {
      res.status(500).json({ error: 'Error update user' });
    }

  }
}

export default UserController




