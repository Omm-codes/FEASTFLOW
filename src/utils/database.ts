import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.config';

export async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Successfully connected to the database.');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}
