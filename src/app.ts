import { server } from './utils/server.util';
import dotenv from 'dotenv';
import { logger } from './utils/logger.util';

dotenv.config();

const serverStarter = server();

serverStarter.listen(
  {
    port: process.env.PORT,
  },
  () => {
    logger.info(`App is listening on ;) ${process.env.HOSTNAME}`);
    logger.info(`Currently running on port: ${process.env.NODE_ENV}`);
  }
);
