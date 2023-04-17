import dotenv from 'dotenv';
import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

dotenv.config();

const connectionParams: IConnectionParameters = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT as unknown as number,
};

export default connectionParams;