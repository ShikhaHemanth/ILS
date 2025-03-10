const mysql = require('mysql');
require('dotenv').config();

// Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysandra1&',
    database: 'individualized_learning'
});

// Connect to the database
function connectToDatabase() {
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) {
                reject('Error connecting to MySQL: ' + err.stack);
            } else {
                resolve('Connected to MySQL database');
            }
        });
    });
}

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

// Function to get academic subjects
async function getSubjectsforStudent(studentID) {
    const query = `
        SELECT s.subjectID, s.subjectName 
        FROM Subjects s
        JOIN Student_Subjects ss ON s.subjectID = ss.subjectID
        WHERE ss.studentID = ? AND ss.isAcademic = TRUE;`;

    return new Promise((resolve, reject) => {
        db.query(query, [studentID], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

module.exports = { connectToDatabase, getUserByEmail, getSubjectsforStudent };