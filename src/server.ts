import express from 'express';
import database from './database';
import router from './routes/router';
import cors from 'cors';
import fs from 'fs';
require('dotenv').config();

const port = process.env.PORT;
const main = async ():Promise<void> => {
  try {
    const app = express();

    // database.sync({alter: true});

    if (process.env.IMG_DIR && !fs.existsSync(process.env.IMG_DIR)){
      fs.mkdirSync(process.env.IMG_DIR, { recursive: true, mode: 0o777 });
    }

    if (process.env.IMG_DIR){
      app.use('/img', express.static(process.env.IMG_DIR));
    }

    app.set('trust proxy', true)
    app.use(express.json({ limit: 200_000_000 }));
    app.use(cors());
    app.use('/', router);

    app.listen(port, () => {
      console.log(`Success, port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void main();





