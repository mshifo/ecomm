import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "./helpers/config";
import { CreateUser1682000767896 } from "./migration/1682000767896-createUser";
import { User } from "./entity/User";

export default new DataSource({
    type: "postgres",
    host: config.db_host,
    port: parseInt(config.db_port as string),
    username: config.db_user,
    password: config.db_password,
    database: config.db_name,
    synchronize: false,
    logging: false,
    entities: [User],
    migrations: [CreateUser1682000767896],
    subscribers: [],
})
