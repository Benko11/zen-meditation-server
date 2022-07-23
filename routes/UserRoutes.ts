import express from 'express';
import { body, check, validationResult } from 'express-validator';
import User from '../models/User';
import { genSalt, hash, compare } from 'bcrypt';
import generateToken from '../utils/generateToken';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
router.post(
    '/register',
    body('name')
        .isLength({ min: 2 })
        .trim()
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .isEmail()
        .trim()
        .withMessage('This is not a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('password').custom((value, { req }) => {
        if (value !== req.body.passwordConfirmation) {
            throw new Error('Passwords do not match');
        }

        return true;
    }),

    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await genSalt(15);
        const hashedPassword = await hash(req.body.password, salt);

        try {
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            });

            res.status(201);
            res.json(user);
        } catch (err) {
            res.status(500);
            res.json({ message: err });
        }
    }
);

router.post(
    '/login',
    body('email').isEmail(),
    body('password').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user == null) {
            console.log('no email found');
            res.status(401);
            res.json({ message: 'These credentials do not match our records' });
            return;
        }

        const passwordIsCorrect = await compare(
            req.body.password,
            user.password
        );

        if (!passwordIsCorrect) {
            console.log('incorrect password');

            res.status(401);
            res.json({ message: 'These credentials do not match our records' });
            return;
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
            preferredTheme: user.preferredTheme,
        });
    }
);

router.get('/list', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ message: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id }).select(
            '-password'
        );
        if (user == null) {
            return res.status(404).json({ message: 'Not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ message: err });
    }
});

export default router;
