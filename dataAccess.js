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

async function getSubjectsForStudent(studentID) {
    return new Promise((resolve, reject) => {
        const query = `SELECT s.subjectName FROM subjects s JOIN student_subject ss ON s.subjectId = ss.subjectId WHERE ss.studentId = ?`;
        db.query(query, [studentID], (error, results) => {
            if (error) {
                console.error("Error retrieving subjects:", error);
                return reject(error); // Reject the promise if there is an error
            }
            resolve(results.map(row => row.subject_name)); // Return array of subjects
        });
    });
}

module.exports = { connectToDatabase, getUserByEmail, getSubjectsForStudent };