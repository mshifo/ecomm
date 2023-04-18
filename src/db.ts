import pgPromise from 'pg-promise';
import config from './helpers/config'

const pgp = pgPromise({});
const db = pgp({
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.environment === 'dev' ? config.db_name : config.db_test_name
});

export default db;
