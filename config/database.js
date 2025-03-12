const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SwapDhiv',
    database: 'feastflow'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Successfully connected to MySQL database');
    
    // Test query to check database retrieval
    connection.query('SELECT * FROM menu', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        console.log('Menu items retrieved successfully:');
        console.log(results);
    });
});

module.exports = connection;
