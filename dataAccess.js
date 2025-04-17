const mysql = require('mysql');
require('dotenv').config();

// Setup MySQL connection
const db = mysql.createConnection({
    host: DB_HOST, 
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
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

async function getAssignmentsForStudent(userId) {
    try {
        const studentId = await getStudentByUserId(userId);
        if (!studentId) return [];
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.subjectName, a.title, a.duedate, a.assignmentId, sa.completed
                FROM student_assignments sa
                JOIN assignments a ON sa.assignmentID = a.assignmentID
                JOIN subjects s ON a.subjectID = s.subjectID
                WHERE sa.studentID = ?
            `;
            db.query(query, [studentId], (error, results) => {
                if (error) {
                    console.error("Error fetching assignments:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getAssignmentsForStudent:", error);
        throw error;
    }
}
async function getAssignmentByAssignmentId(AssignmentId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM assignments WHERE assignmentID = ?`;
            db.query(query, [AssignmentId], (error, results) => {
                if (error) {
                    console.error("Error fetching assignment details:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getAssignmentByAssignmentId:", error);
        throw error;
    }
}
async function getSubmissionsByStudent(userId) {
    try {
        const studentId = await getStudentByUserId(userId);
        if (!studentId) return [];
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM submissions WHERE studentID = ?`;
            db.query(query, [studentId], (error, results) => {
                if (error) {
                    console.error("Error fetching assignment details:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getSubmissionsByStudent:", error);
        throw error;
    }
}
async function saveSubmission(userID, assignmentID, fileURL) {
    try {
        const studentId = await getStudentByUserId(userID);

        if (!studentId) {
            console.log("No student found for userID:", userID);
            return [];
        }
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Submissions (assignmentID, studentId, fileURL) VALUES (?, ?, ?)`;
            db.query(query, [assignmentID, studentId, fileURL], (error, results) => {
                if (error) {
                    console.error("Error saving submission:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in saveSubmission:", error);
        throw error;
    }
}

module.exports = { connectToDatabase, getUserByEmail, getStudentByUserId, getSubjectsForStudent, getAssignmentsForStudent, getAssignmentByAssignmentId, saveSubmission, getSubmissionsByStudent };