import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import Session from '../models/Session';
import User from '../models/User';

const router = express.Router();
router.post('/', protect, async (req: any, res) => {
    try {
        const newSession = await Session.create({
            length: req.body.length,
            userId: req.id,
        });
        res.status(201).json(newSession);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get('/:id', protect, async (req, res) => {
    const session = await Session.findOne({ _id: req.params.id });
    if (session == null) {
        return res.status(404).json({ message: 'Not Found' });
    }

    res.json(session);
});

router.patch('/:id/toggle', protect, async (req, res) => {
    const session = await Session.findOne({ _id: req.params.id });
    if (session == null) {
        return res.status(404).json({ message: 'Not Found' });
    }

    const updated = await Session.updateOne(
        { _id: req.params.id },
        { finished: !session.finished }
    );
    res.json(updated);
});

router.patch('/:id/toggle-theme', protect, async (req: any, res) => {
    try {
        const user = await User.findOne({ id: req.id });
        if (user == null) {
            return res.status(404).json({ message: 'Not found' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: req.id },
            { preferredTheme: req.params.id }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ message: err });
    }
});

router.patch(
    '/update-info',
    protect,
    body('name').isLength({ min: 2 }),
    body('email').isEmail(),
    async (req: any, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            const user = await User.findOne({ id: req.id });
            if (user == null) {
                return res.status(404).json({ message: 'Not found' });
            }

            const updatedUser = await User.findOneAndUpdate(
                { id: req.id },
                { name: req.body.name, email: req.body.email }
            );
            res.json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err });
        }
    }
);
export default router;
