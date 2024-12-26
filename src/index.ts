import express from 'express';
import userRoutes from './routes/user';
import partnerRoutes from './routes/partner';


import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/partner', partnerRoutes);

const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
