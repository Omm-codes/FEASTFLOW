import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables!');
    process.exit(1);
}

export const verifyJwtSetup = () => {
    try {
        // Test JWT signing
        const testToken = jwt.sign({ test: true }, process.env.JWT_SECRET);
        jwt.verify(testToken, process.env.JWT_SECRET);
        console.log('JWT configuration is valid');
        return true;
    } catch (error) {
        console.error('JWT configuration error:', error.message);
        return false;
    }
};