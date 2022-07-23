import jwt from 'jsonwebtoken';

export default function generateToken(id: String) {
    if (process.env.JWT_SECRET != null)
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    throw new Error('JWT secret is not specified');
}
