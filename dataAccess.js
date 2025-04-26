const mysql = require('mysql');
require('dotenv').config();

// Setup MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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
        const query = 'SELECT userID, name, password, role FROM Users WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                console.error("Error retrieving user:", error);
                return reject(error); // Reject the promise if there is an error
            }
            resolve(results.length > 0 ? results[0] : null); // Resolve with user data or null
        });
    });
}

async function getUserByUserId(userID) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT userID, email, name, role FROM Users WHERE userID = ?';
        db.query(query, [userID], (error, results) => {
            if (error) {
                console.error("Error retrieving user:", error);
                return reject(error); // Reject the promise if there is an error
            }
            resolve(results.length > 0 ? results[0] : null); // Resolve with user data or null
        });
    });
}

// Function to get student ID from userID
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

// Function to get student ID from userID
async function getUserIdByStudentId(studentId) {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT userid FROM students WHERE studentid = ?", 
            [studentId],
            (err, studentResults) => {
                if (err) {
                    console.error("Error retrieving student ID:", err);
                    return reject(err);
                }
                if (!studentResults.length) {
                    return resolve(null); // No student found
                }
                resolve(studentResults[0]);
            }
        );
    });
}

async function saveMood(studentId, mood) {
    try {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO MoodCheckins (studentId, mood) VALUES (?, ?)`;
            db.query(query, [studentId, mood], (error, results) => {
                if (error) {
                    console.error("Error saving mood:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in saveMood:", error);
        throw error;
    }
}

// Function to get academic subjects
async function getSubjectsForStudent(studentId) {
    try {        
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
                resolve(results); // Return the full array of subjects
            });
        });
    } catch (error) {
        console.error("Error in getSubjectsForStudent:", error);
        throw error;
    }
}

async function getAssignmentsForStudent(studentId) {
    try {
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
async function getSubmissionsByStudent(studentId) {
    try {
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
            const query = `INSERT INTO Submissions (assignmentID, studentId, uploadsFileName) VALUES (?, ?, ?)`;
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

async function getTeachersbyStudentId(studentId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT t.teacherID, u.name AS teacherName, t.userid
                FROM Student_Teachers st
                JOIN Teachers t ON st.teacherID = t.teacherID
                JOIN Users u ON t.userID = u.userID
                WHERE st.studentID = ?
            `;
            db.query(query, [studentId], (error, results) => {
                if (error) {
                    console.error("Error fetching teachers for student:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getTeachersByStudentId:", error);
        throw error;
    }
}

async function getMessagesBetweenUsers(senderId, receiverId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM messages 
                WHERE (senderId = ? AND receiverId = ?) 
                OR (senderId = ? AND receiverId = ?)
                ORDER BY timestamp ASC
            `;
            db.query(query, [senderId, receiverId, receiverId, senderId], (error, results) => {
                if (error) {
                    console.error("Error fetching messages:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getMessagesBetweenUsers:", error);
        throw error;
    }  
}

async function getCounselorbyStudentId(studentId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.counselorID, u.name AS counselorName, c.userid
                FROM Students s
                JOIN Counselors c ON s.counselorID = c.counselorID
                JOIN Users u ON c.userID = u.userID
                WHERE s.studentID = ?
            `;
            db.query(query, [studentId], (error, results) => {
                if (error) {
                    console.error("Error fetching counselor for student:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getCounselorsbyStudentId:", error);
        throw error;
    }
}

async function saveMessage (senderId, receiverId, content) {
    try {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Messages (senderId, receiverId, content) VALUES (?, ?, ?)`;
            db.query(query, [senderId, receiverId, content], (error, results) => {
                if (error) {
                    console.error("Error saving message:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in saveMessage:", error);
        throw error;
    }
}

async function getStudentsByTeacherId(teacherId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.studentID, u.name AS studentName
                FROM Student_Teachers st
                JOIN Students s ON st.studentID = s.studentID
                JOIN Users u ON s.userID = u.userID
                WHERE st.teacherID = ?
            `;

            db.query(query, [teacherId], (error, results) => {
                if (error) {
                    console.error("Error fetching students for teacher:", error);
                }
                resolve(results); // Resolve with counselor data
            });
        });
    } catch (error) {
        console.error("Error in getStudentsByTeacherId:", error);
        throw error;
    }
}

async function getCounselorByUserId(userID) {
    try{ 
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.userID, c.counselorID, u.name 
                FROM Users u
                JOIN Counselors c ON u.userID = c.userID
                WHERE u.userID = ?
            `;
            db.query(query, [userID], (error, results) => {
                if (error) {
                    console.error("Error retrieving counselor:", error);
                    return reject(error);
                }
                resolve(results.length > 0 ? results[0] : null); // Resolve with counselor data
            });
        });
    } catch (error) {
        console.error("Error in getStudentsByUserId:", error);
        throw error;
    }
};


async function getStudentsByCounselorID(counselorID) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.studentID, u.name
                FROM Students s
                JOIN Users u ON s.userID = u.userID
                WHERE s.counselorID = ?
            `;
            db.query(query, [counselorID], (error, results) => {
                if (error) {
                    console.error("Error fetching students for counselor:", error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    } catch (error) {
        console.error("Error in getStudentsByCounselorID:", error);
        throw error;
    }
}

async function getTeacherbyUserId(userId) {
    try {
        return new Promise((resolve, reject) => {
            const query = ` select t.teacherid, u.name
                FROM teachers t
                JOIN users u ON t.userid = u.userid
                WHERE u.userid = ?
            `;
            db.query(query, [userId], (error, results) => {
                if (error) {
                    console.error("Error fetching teacherid for teacher:", error);
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    } catch (error) {
        console.error("Error in getTeacherIdbyUserId:", error);
        throw error;
    }
}

async function getParentByUserId(userId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.parentId, u.name
                FROM parents p
                JOIN users u ON p.userId = u.userId
                WHERE u.userId = ?
            `;
            db.query(query, [userId], (error, results) => {
                if (error) {
                    console.error("Error fetching parentId for parent:", error);
                    return reject(error);
                }
                // console.log(results)
                resolve(results[0]);
            });
        });
    } catch (error) {
        console.error("Error in getParentByUserId:", error);
    }
}

async function getCompletedAssignments(studentname, teacherId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT a.title
                FROM Assignments a
                JOIN Student_Assignments sa ON a.assignmentID = sa.assignmentID
                JOIN Student_Subjects ss ON a.subjectID = ss.subjectID
                WHERE sa.studentID = (SELECT studentID FROM Students WHERE userID = (SELECT userID FROM Users WHERE name = ?)) 
                AND sa.completed = 1
                AND ss.subjectID = (SELECT subjectID FROM Teachers WHERE teacherID = ?)
            `;
            db.query(query, [studentname, teacherId], (error, results) => {
                if (error) {
                    console.error("Error fetching completed assignments:", error);
                    return reject(error);
                }
                resolve(results); // Resolve with completed assignments data
            });
        });
    } catch (error) {
        console.error("Error in getCompletedAssignments:", error);
        throw error;
    }
}

async function getStudentsByParentId(parentId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.studentID, u.name
                FROM Students s
                JOIN Users u ON s.userID = u.userID
                JOIN parents p ON s.StudentID = p.StudentID
                WHERE p.parentID = ?
            `;
            db.query(query, [parentId], (error, results) => {
                if (error) {
                    console.error("Error fetching students for parent:", error);
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    } catch (error) {
        console.error("Error in getStudentsByParentId:", error);
    }
}

async function getYetToCompleteAssignments(studentname, teacherId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT a.title
                FROM Assignments a
                JOIN Student_Assignments sa ON a.assignmentID = sa.assignmentID
                JOIN Student_Subjects ss ON a.subjectID = ss.subjectID
                WHERE sa.studentID = (SELECT studentID FROM Students WHERE userID = (SELECT userID FROM Users WHERE name = ?)) 
                AND sa.completed = 0
                AND ss.subjectID = (SELECT subjectID FROM Teachers WHERE teacherID = ?)
            `;
            db.query(query, [studentname, teacherId], (error, results) => {
                if (error) {
                    console.error("Error fetching yet-to-complete assignments:", error);
                    return reject(error);
                }
                resolve(results); // Resolve with yet-to-complete assignments data
            });
        });
    } catch (error) {
        console.error("Error in getYetToCompleteAssignments:", error);
        throw error;
    }
}

async function getUploadedAssignments(studentid, teacherId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    a.assignmentID,
                    a.title,
                    a.description,
                    a.dueDate,
                    sa.completed
                FROM Assignments a
                JOIN Student_Assignments sa ON a.assignmentID = sa.assignmentID
                JOIN Teachers t ON a.subjectID = t.subjectID
                WHERE sa.studentID = ?
                AND t.teacherID = ?
            `;
            db.query(query, [studentid, teacherId], (error, results) => {
                if (error) {
                    console.error("Error fetching uploaded assignments:", error);
                    return reject(error);
                }
                resolve(results); // Resolve with the uploaded assignments
            });
        });
    } catch (error) {
        console.error("Error in getUploadedAssignments:", error);
        throw error;
    }
}
async function getSubjectIdByTeacherId(teacherId) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT subjectid FROM teachers where teacherid=?;
            `;
            db.query(query, [teacherId], (error, results) => {
                if (error) {
                    console.error("Error fetching subjectId:", error);
                    return reject(error);
                }
                resolve(results); // Resolve with the uploaded assignments
            });
        });
    } catch (error) {
        console.error("Error in getsubjectidbyteacherid:", error);
        throw error;
    }
}

// Function to insert a new assignment upload into the database
async function uploadAssignment(studentID, subjectID, fileName, contentType, uploadDate) {
    try {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO SubjectContent (fileName, contentType, uploadDate, studentId, subjectId)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(query, [fileName, contentType, uploadDate, studentID, subjectID], (error, results) => {
                if (error) {
                    console.error("Error uploading assignment:", error);
                    return reject(error);
                }
                resolve(results); // Resolve after successful upload
            });
        });
    } catch (error) {
        console.error("Error in uploadAssignment:", error);
        throw error;
    }
}


async function getLearningPlansByStudentId(studentID) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Learning_plans WHERE studentID = ?', [studentID], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
}

async function addLearningPlan(adaptiveFeatures, progressSummary, studentID) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO Learning_plans (adaptiveFeatures, progressSummary, studentID) VALUES (?, ?, ?)', 
            [adaptiveFeatures, progressSummary, studentID], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
    });
}


module.exports = { connectToDatabase, getUserByUserId, getUserByEmail, getStudentByUserId, getSubjectsForStudent, 
    getAssignmentsForStudent, getAssignmentByAssignmentId, saveSubmission, getSubmissionsByStudent, saveMood, getTeachersbyStudentId, 
    getCounselorbyStudentId,getCounselorByUserId, getMessagesBetweenUsers, getStudentsByCounselorID, getTeacherbyUserId, 
    saveMessage, getStudentsByTeacherId, getUserIdByStudentId, getParentByUserId, getStudentsByParentId, getUploadedAssignments, 
    uploadAssignment, getCompletedAssignments, getYetToCompleteAssignments, getLearningPlansByStudentId, getUploadedAssignments,
    getSubjectIdByTeacherId, getLearningPlansByStudentId,addLearningPlan };
