"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const config_1 = __importDefault(require("./config"));
const pgp = (0, pg_promise_1.default)({});
const db = pgp(config_1.default.db);
exports.default = db;
