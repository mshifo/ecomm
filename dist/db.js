"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const config_1 = __importDefault(require("./helpers/config"));
const pgp = (0, pg_promise_1.default)({});
const db = pgp({
    host: config_1.default.db_host,
    user: config_1.default.db_user,
    password: config_1.default.db_password,
    database: config_1.default.environment === 'dev' ? config_1.default.db_name : config_1.default.db_test_name
});
exports.default = db;
