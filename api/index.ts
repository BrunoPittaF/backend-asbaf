import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import partnerRoutes from './routes/partner';
import noticeRoutes from './routes/notice';


import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
const app = express();
dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001', // URL local de desenvolvimento
  //  // URL local de desenvolvimento
  'https://asbaf-definitivo.vercel.app', // URL de produção
  'https://asbaf.org' // URL de produção

];

// Configuração do CORS com validação dinâmica
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Permitir requisições sem origin (Postman, etc.) ou dentro da lista
      callback(null, true);
    } else {
      // Bloquear origin não autorizado
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Métodos HTTP permitidos
  allowedHeaders: 'Content-Type,Authorization', // Cabeçalhos permitidos
};

// Aplicar o middleware CORS
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));

// app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/partner', partnerRoutes);
app.use('/notice', noticeRoutes);


const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('API funcionando!');
});


export default app;