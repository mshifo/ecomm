"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailUniqueness = exports.validateUserInput = void 0;
const db_1 = __importDefault(require("../db"));
// Middleware function to validate user input
const validateUserInput = (req, res, next) => {
    const { name, email } = req.body;
    // Check if name and email are present
    if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
    }
    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
    }
    // Move to the next middleware function if validation passes
    next();
};
exports.validateUserInput = validateUserInput;
// Middleware function to validate email uniqueness
const validateEmailUniqueness = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // Check if email already exists, excluding the current user
        let result;
        if (req.params.id) {
            result = yield db_1.default.query('SELECT * FROM users WHERE email = $1 AND id <> $2', [email, req.params.id]);
        }
        else {
            result = yield db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        }
        console.log(result);
        if (result.length > 0) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
    }
    catch (error) {
        console.error('Error querying database', error);
        res.status(500).json({ message: 'Email must be unique' });
        return;
    }
    // Move to the next middleware function if validation passes
    next();
});
exports.validateEmailUniqueness = validateEmailUniqueness;
