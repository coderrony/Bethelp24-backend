import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app';
import logger from './configs/logger.config';

// dotenv config for access .env
dotenv.config();

// env variables
const { DATABASE_URL } = process.env;

// env variable
const PORT = process.env.PORT || 8000;

//exit on mongodb error
mongoose.connection.on('error', err => {
  logger.error('mongodb connection error: ', err);
  process.exit(1); // stop server
});

//mongodb debug mode for complex query
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

// mongodb connection
mongoose.connect(DATABASE_URL!).then(() => {
  logger.info('Connect to mongodb');
});

let server;

server = app.listen(PORT, () => {
  logger.info(`server listening on port http://localhost:${PORT}`);
});

// handle server error
const exitHandler = () => {
  if (server) {
    logger.info('server closed');
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

//SIGTERM
process.on('SIGTERM', () => {
  if (server) {
    logger.info('Server closed.');
    process.exit(1);
  }
});
