import express from 'express';
import cors from "cors";
import usersRouter from './routes/users';
import authRouter from "./routes/auth";
import config from './helpers/config'

const app = express()

app.use(express.urlencoded({extended: false})); //
app.use(express.json()); //
app.use(cors());

app.use('/admin/users', usersRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Well done!');
})


const PORT = config.port || 3000;

if (config.environment !== 'test') {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}

export default app;