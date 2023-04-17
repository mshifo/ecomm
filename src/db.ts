import pgPromise from 'pg-promise';
import config from './config';

const pgp = pgPromise({});
const db = pgp(config);

export default db;
