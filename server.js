const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const { encryptPasswords } = require('./encrypt');
const { loginUser } = require('./businessLogic');
const { connectToDatabase, getUserByEmail, getSubjectsForStudent, getStudentAssignmentProgress } = require('./dataAccess');

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


    // Middleware to check authentication
    function isAuthenticated(req, res, next) {
        if (req.session.userId) {
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
                req.session.userId = userData.userID; // Store user ID in session
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
        if (!req.session.userId) {
            return res.redirect('/login'); // Ensure user is logged in
        }
        const userID = req.session.userId; // Get student ID from session
        try {
            const progressData = await getStudentAssignmentProgress(userID);
            const subjects = await getSubjectsForStudent(userID); // Fetch subjects
            if (!Array.isArray(subjects)) {  // Ensure subjects is an array
                console.error("Unexpected data format:", subjects);
                return res.status(500).send("Server error: subjects data is invalid");
            }
            res.render('student/student_dashboard', { subjects, totalAssignments: progressData.total, completedAssignments: progressData.completed }); // Pass subjects to EJS
        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading dashboard");
        }
    });

    app.get('/student/:subjectName', (req, res) => {
        const subjectName = req.params.subjectName;
        res.render('student/student_subject', { subjectName });
    });

    app.get('/teacher_dashboard', isAuthenticated, (req, res) => res.render('teacher/teacher_dashboard'));
    app.get('/counselor_dashboard', isAuthenticated, (req, res) => res.render('counselor/counselor_dashboard'));
    app.get('/parent_dashboard', isAuthenticated, (req, res) => res.render('parent/parent_dashboard'));

    // app.get('/student_dashboard/subject', isAuthenticated, (req, res) => {
    //     res.render('student/student_subject')
    // })

    app.get('/student_dashboard/subject/activity', isAuthenticated, (req, res) => {
        res.render('student/student_activity')
    })

    app.get('/student_dashboard/submission', isAuthenticated, (req, res) => {
        res.render('student/student_submission')
    })

    app.get('/student_dashboard/feedback', isAuthenticated, (req, res) => {
        res.render('student/student_feedback')
    })



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