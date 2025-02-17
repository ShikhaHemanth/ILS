const bcrypt = require('bcrypt');
const mysql = require('mysql');

// Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harshikha1619',
    database: 'individualized_learning'
});

// Function to wrap db.query() in a promise
function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

async function encryptPasswords() {
    try {
        console.log("Starting password encryption process...");
        
        // Fetch users who haven't had their passwords encrypted yet
        const rows = await queryAsync('SELECT userID, password FROM Users WHERE is_pwd_encrypted = 0');

        if (rows.length === 0) {
            console.log("No passwords need encryption.");
            return;
        }

        for (let row of rows) {
            const hashedPassword = await bcrypt.hash(row.password, 10); // Hash the password

            // Update the password and mark as encrypted
            await queryAsync('UPDATE Users SET password = ?, is_pwd_encrypted = 1 WHERE userID = ?', [hashedPassword, row.userID]);
        }

        console.log('All passwords were encrypted successfully!');
    } catch (err) {
        console.error('An error occurred during the encryption process:', err);
    }
}

module.exports = { encryptPasswords };
