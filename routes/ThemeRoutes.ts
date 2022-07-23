import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import Theme from '../models/Theme';
import User from '../models/User';
import rgbToHsl from '../utils/rgbToHsl';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const themes = await Theme.find();
        res.json(themes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
});

router.post(
    '/',
    body('name').isLength({ min: 5 }),
    body('colour')
        .trim()
        .matches(
            /^\#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]$/
        ),
    body('interval').isInt({ min: 0, max: 180 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { name, colour, interval } = req.body;
        const rgbTriplet: number[] = [
            parseInt(colour.substring(1, 3), 16),
            parseInt(colour.substring(3, 5), 16),
            parseInt(colour.substring(5), 16),
        ];

        const hslTriplet = rgbToHsl(
            rgbTriplet[0],
            rgbTriplet[1],
            rgbTriplet[2]
        );

        const newTheme = await Theme.create({
            name,
            colour: hslTriplet,
            interval,
        });

        res.status(201).json(newTheme);
    }
);

router.delete('/:id', async (req, res) => {
    const theme = await Theme.findOneAndRemove({ id: req.params.id });
    res.json(theme);
});

router.get('/default', async (req, res) => {
    try {
        const theme = await Theme.findOne({ isDefault: true });
        if (theme == null) {
            return res.status(404).json({ message: 'Not Found' });
        }

        res.json(theme);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ message: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const theme = await Theme.findOne({ _id: req.params.id });
        if (theme == null) {
            return res.status(404).json({ message: 'Not Found' });
        }

        res.json(theme);
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ message: err });
    }
});

export default router;
