const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { encryptPasswords } = require('./encrypt');
const { loginUser } = require('./businessLogic');
const { connectToDatabase, getUserByUserId, getUserByEmail, getSubjectsForStudent, getAssignmentsForStudent, 
    getAssignmentByAssignmentId, saveSubmission, getSubmissionsByStudent, getStudentByUserId, saveMood, getTeachersbyStudentId, 
    getCounselorbyStudentId } = require('./dataAccess');

// Set up multer to store files in uploads folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

async function setup() {
    try {
        // Encrypt passwords before starting the server
        await encryptPasswords();
        console.log("Setup completed successfully. Starting the server...");

        startServer();
    } catch (error) {
        console.error("Setup error:", error);
    }
}

async function startServer() {
    const app = express();

    const http = require('http').createServer(app);
    const io = require('socket.io')(http);

    // Session setup
    app.use(session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true
    }));

    // Set EJS as the view engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('views'));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Middleware to check authentication
    function isAuthenticated(req, res, next) {
        if (req.session.userID) {
            return next();
        } else {
            res.redirect('/');
        }
    }

    // Routes
    app.get('/', (req, res) => {
        res.render('main');
    });

    app.get('/login', (req, res) => {
        res.render('login', { error: null });
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const result = await loginUser(email, password);
            const userData = await getUserByEmail(email);
            if (result.success) {
                req.session.userID = userData.userID; // Store user ID in session
                return res.json({ success: true, redirectUrl: result.redirectUrl });
            } else {
                return res.json({ success: false, message: result.message });
            }
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    });

    // Protected Route
    app.get('/student_dashboard', isAuthenticated, async(req, res) => {
        if (!req.session.userID) {
            return res.redirect('/login'); // Ensure user is logged in
        }
        const userID = req.session.userID; // Get student ID from session
        try {
            const studentID = await getStudentByUserId(userID);
                if (!studentID) {
                    console.log("No student found for userID:", userID);
                    return [];
                }
            const subjects = await getSubjectsForStudent(studentID); // Fetch subjects
            const assignments = await getAssignmentsForStudent(studentID);
            const student = await getUserByUserId(userID);
            const currentMood = req.session.mood || null;
            const teachers = await getTeachersbyStudentId(studentID);
            const counselor = await getCounselorbyStudentId(studentID);
            if (!Array.isArray(subjects)) {  // Ensure subjects is an array
                console.error("Unexpected data format:", subjects);
                return res.status(500).send("Server error: subjects data is invalid");
            }
            res.render('student/student_dashboard', { subjects, 
                completedAssignments: assignments.filter(a => a.completed).length,
                totalAssignments: assignments.length, 
                assignments, student, currentMood, teachers, counselor }); // Pass to EJS
        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading dashboard");
        }
    });

    app.post('/student/savemood', async (req, res) => {
        const userID = req.session.userID;
        const mood = req.body.mood;

        if (!userID || !mood) {
            return res.status(400).json({ success: false, message: "Missing user or mood" });
        }

        try {
            const studentID = await getStudentByUserId(userID);
            if (!studentID) {
                console.log("No student found for userID:", userID);
                return [];
            }
            await saveMood(studentID, mood);
            req.session.mood = mood; // Save in session
            res.json({ success: true });
        } catch (err) {
            console.error('Error saving mood:', err);
            res.status(500).json({ success: false, message: 'Internal error' });
        }
    });

    app.get('/student_dashboard/:subjectName', isAuthenticated, async (req, res) => {
        const userID = req.session.userID; // assuming student is logged in
        const subjectName = req.params.subjectName;

        try {
            const studentID = await getStudentByUserId(userID);
                if (!studentID) {
                    console.log("No student found for userID:", userID);
                    return [];
                }
            const assignments = await getAssignmentsForStudent(studentID);
            res.render('student/student_subject', { subjectName, assignments });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error loading subject dashboard');
        }
    });

    app.get('/student_dashboard/:subjectName/:assignmentId', isAuthenticated, async (req, res) => {
        const subjectName = req.params.subjectName;
        const assignmentID = req.params.assignmentId;
    
        try {
            const assignmentDetails = await getAssignmentByAssignmentId(assignmentID);
            res.render('student/student_activity', { subjectName, assignment: assignmentDetails[0] });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error loading activity dashboard');
        }
    });

    app.get('/student_dashboard/:subjectName/activity/submission', isAuthenticated, async (req, res) => {
        const userID = req.session.userID; // assuming student is logged in
        const subjectName = req.params.subjectName;
        try {
            const studentID = await getStudentByUserId(userID);
                if (!studentID) {
                    console.log("No student found for userID:", userID);
                    return [];
                }
            const assignments = await getAssignmentsForStudent(studentID);
            const filteredAssignments = assignments.filter(a =>
                a.subjectName.toLowerCase() === subjectName.toLowerCase()
            );
            const submissions = await getSubmissionsByStudent(studentID);
            res.render('student/student_submission', { subjectName, assignments: filteredAssignments, submissions });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error loading submission dashboard');
        }
    })
    
    app.post('/student_dashboard/:subjectName/activity/submission/upload', upload.single('file'), async (req, res) => {
        const assignmentID = req.body.assignmentID;
        const userID = req.session.userID; // or use token decoding

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
          }
        const filename = req.file.filename;
        try {
          // Insert into the DB (adjust your query as per your schema)
          await saveSubmission(userID, assignmentID, filename);       
          res.json({ success: true, filename });
        } catch (error) {
            console.error('Error saving submission:', error);
            res.status(500).send('Submission failed');
        }
      });

    app.get('/download/:filename', isAuthenticated, (req, res) => {
        const filePath = path.join(__dirname, 'uploads', req.params.filename);
        res.download(filePath);
    });

    app.get('/teacher_dashboard', isAuthenticated, (req, res) => res.render('teacher/teacher_dashboard'));
    app.get('/counselor_dashboard', isAuthenticated, (req, res) => res.render('counselor/counselor_dashboard'));
    app.get('/parent_dashboard', isAuthenticated, (req, res) => res.render('parent/parent_dashboard'));

    // app.get('/student_dashboard/:subjectName/activity/feedback', isAuthenticated, async (req, res) => {
    //     const userID = req.session.userID; // assuming student is logged in
    //     const subjectName = req.params.subjectName;
    //     try {
    //         const studentID = await getStudentByUserId(userID);
    //             if (!studentID) {
    //                 console.log("No student found for userID:", userID);
    //                 return [];
    //             }
    //         const assignments = await getAssignmentsForStudent(studentID);
    //         const filteredAssignments = assignments.filter(a =>
    //             a.subjectName.toLowerCase() === subjectName.toLowerCase()
    //         );
    //         const submissions = await getSubmissionsByStudent(userID);
    //         res.render('student/student_submission', { subjectName, assignments: filteredAssignments, submissions });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Error loading submission dashboard');
    //     }
    // })

    // Aryas workspace
    // Protected Route
    // app.get('/teacher_dashboard', isAuthenticated, async(req, res) => {
    //     if (!req.session.userID) {
    //         return res.redirect('/login'); // Ensure user is logged in
    //     }
    //     const userID = req.session.userID; // Get student ID from session
    //     const teacherid = await getTeacherIdbyUserId(userID); // Fetch subjects
    //     const students =await getStudentsbyTeacherId(teacherid)
    //     try {
    //         res.render('teacher/teacher_dashboard', { students, teachername }); 
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Error loading dashboard");
    //     }
    // });


// Sakshis workspace 

// app.get('/counselor_dashboard', isAuthenticated, (req, res) => {
//     if (!req.session.userID) {
//         return res.redirect('/login'); // Ensure user is logged in
//     }
//     const userID = req.session.userID; // Get student ID from session
    
//     res.render('counselor/counselor_dashboard')
// });


    // Connect to database and start server
    try {
        // Attempt to connect to the database before starting the server
        await connectToDatabase();
        console.log('Database connection successful.');
        
        // Start the server only after the database connection
        app.listen(4000, () => {
            console.log('Server running on http://localhost:4000');
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Run setup before starting the server
setup();