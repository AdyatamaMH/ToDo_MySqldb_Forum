const express = require('express');
const mysql = require('mysql');

const db_config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'Labmda767',
    database: 'todoschema'
};

const pool = mysql.createPool(db_config);

const app = express();

app.get('/tasks', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        connection.query('SELECT * FROM tasks', (error, results, fields) => {
            connection.release();
            if (error) {
                console.error('Error fetching tasks from MySQL:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.json(results);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
