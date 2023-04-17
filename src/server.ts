import express from 'express';
import cors from "cors";
import usersRouter from './routes/users';
import authRouter from "./routes/auth";
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(express.urlencoded({extended: false})); //
app.use(express.json()); //
app.use(cors());

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Well done!');
})


const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}

export default app;