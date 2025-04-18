import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const testJWT = () => {
    try {
        const testPayload = { test: true };
        const token = jwt.sign(testPayload, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('JWT Test Success:', decoded);
        return true;
    } catch (error) {
        console.error('JWT Test Failed:', error.message);
        return false;
    }
};

testJWT();