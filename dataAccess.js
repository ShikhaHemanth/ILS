const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "Mysandra1&",
    database: process.env.DB_NAME || "individualized_learning",
    connectionLimit: 10
});

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT userID, password, role FROM Users WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                console.error("Error retrieving user:", error);
                return reject(error); // Reject the promise if there is an error
            }
            resolve(results.length > 0 ? results[0] : null); // Resolve with user data or null
        });
    });
}

module.exports = { getUserByEmail };