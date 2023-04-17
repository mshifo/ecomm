import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import User from "../models/User";
import { validate, loginRequestSchema, registerRequestSchema } from "../middleware/auth.validators";
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Register a new user
router.post("/register", validate(registerRequestSchema), async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already in use
        const existingUser = await db.query<User>(
            "SELECT * FROM USERS WHERE email = $1",
            [email]
        );

        if (existingUser.length && existingUser.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const newUser = await db.query<User>(
            "INSERT INTO USERS (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        // Generate a JWT token
        const token = jwt.sign(
            { id: newUser.id },
            JWT_SECRET as string
        );

        res.json({ token });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Log in a user
router.post("/login", validate(loginRequestSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const existingUser = await db.query<User | any>(
            "SELECT * FROM USERS WHERE email = $1",
            [email]
        );

        if (existingUser.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(
            password,
            existingUser[0].password
        );


        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: existingUser.id },
            JWT_SECRET as string
        );

        res.json({ token });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

export default router;
