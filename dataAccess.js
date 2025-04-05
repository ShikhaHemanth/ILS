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

// Function to get student ID from user ID
async function getStudentByUserId(userId) {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT studentid FROM students WHERE userid = ?", 
            [userId],
            (err, studentResults) => {
                if (err) {
                    console.error("Error retrieving student ID:", err);
                    return reject(err);
                }
                if (!studentResults.length) {
                    return resolve(null); // No student found
                }
                resolve(studentResults[0].studentid);
            }
        );
    });
}

// Function to get academic subjects
async function getSubjectsForStudent(userId) {
    try {
        const studentId = await getStudentByUserId(userId);
        if (!studentId) return []; // No student found
        
        return new Promise((resolve, reject) => {
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
        });
    } catch (error) {
        console.error("Error in getSubjectsForStudent:", error);
        throw error;
    }
}

// Function to get student's assignment progress
async function getStudentAssignmentProgress(userId) {
    try {
        const studentId = await getStudentByUserId(userId);
        if (!studentId) return { total: 0, completed: 0 }; // No student found

        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    COUNT(*) AS totalAssignments, 
                    SUM(completed) AS completedAssignments 
                FROM student_assignments 
                WHERE studentID = ?
            `;

            db.query(query, [studentId], (error, results) => {
                if (error) {
                    console.error("Error retrieving assignment progress:", error);
                    return reject(error);
                }

                const total = results[0].totalAssignments || 0;
                const completed = results[0].completedAssignments || 0;

                resolve({ total, completed });
            });
        });
    } catch (error) {
        console.error("Error in getStudentAssignmentProgress:", error);
        throw error;
    }
}

async function getIncompleteAssignmentsForStudent(userId) {
    try {
        const studentId = await getStudentByUserId(userId);
        if (!studentId) return [];

        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.subjectName, a.title, a.duedate
                FROM student_assignments sa
                JOIN assignments a ON sa.assignmentID = a.assignmentID
                JOIN subjects s ON a.subjectID = s.subjectID
                WHERE sa.studentID = ? AND sa.completed = 0
            `;
            db.query(query, [studentId], (error, results) => {
                if (error) {
                    console.error("Error fetching incomplete assignments:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getIncompleteAssignmentsForStudent:", error);
        throw error;
    }
}

module.exports = { connectToDatabase, getUserByEmail, getStudentByUserId, getSubjectsForStudent, getStudentAssignmentProgress, getIncompleteAssignmentsForStudent };