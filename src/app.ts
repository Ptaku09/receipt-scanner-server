import { createServer } from './utils/createServer';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

const serverStarter = createServer();

serverStarter.listen(
  {
    port: process.env.PORT,
  },
  () => {
    logger.info(`App is listening on ;) ${process.env.HOSTNAME}`);
    logger.info(`Currently running on port: ${process.env.NODE_ENV}`);
  }
);
