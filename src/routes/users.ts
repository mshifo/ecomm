import { Router, Request, Response } from 'express';
import db from "../db";
import { validateUserInput, validateEmailUniqueness } from "../middleware/user.validators"

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await db.any('SELECT * FROM USERS');
        //console.table(users)
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', validateUserInput, validateEmailUniqueness, async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const user = await db.one(
            'INSERT INTO USERS(name, email) VALUES($1, $2) RETURNING id, name, email',
            [name, email]
        );
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await db.oneOrNone('SELECT * FROM USERS WHERE id = $1', id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', validateUserInput, validateEmailUniqueness, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await db.oneOrNone(
            'UPDATE USERS SET name = $2, email = $3 WHERE id = $1 RETURNING id, name, email',
            [id, name, email]
        );
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.result('DELETE FROM USERS WHERE id = $1', id);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
