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
async function getSubjectsForStudent(userId) {
    return new Promise((resolve, reject) => {
        // Get the student ID from the students table
        db.query(
            "SELECT studentid FROM students WHERE userid = ?", 
            [userId],
            (err, studentResults) => {
                if (err) {
                    console.error("Error retrieving student ID:", err);
                    return reject(err);
                }
                if (!studentResults.length) {
                    return resolve([]); // No student found, return empty array
                }

                const studentId = studentResults[0].studentid;
                const subjectQuery = `
                    SELECT ss.subjectID, s.subjectName 
                    FROM student_subjects ss 
                    JOIN subjects s ON ss.subjectID = s.subjectID 
                    WHERE ss.studentid = ?
                `;

                db.query(subjectQuery, [studentId], (error, results) => {
                    if (error) {
                        console.error("Error retrieving subjects:", error);
                        return reject(error);
                    }
                    resolve(results); // ✅ Return the full array of subjects
                });
            }
        );
    });
}

module.exports = { connectToDatabase, getUserByEmail, getSubjectsForStudent };