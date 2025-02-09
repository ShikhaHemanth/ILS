const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const { encryptPasswords } = require('./encrypt');
const { loginUser } = require('./businessLogic');
const { getUserByEmail, connectToDatabase } = require('./dataAccess');

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

function startServer() {
    const app = express();

    // Parse JSON and URL-encoded data
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname));

    // Session setup
    app.use(session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true
    }));

    // Set EJS as the view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

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
            if (result.success) {
                req.session.userId = result.userId; // Store user ID in session
                return res.redirect(result.redirectUrl);
            } else {
                return res.render('login', { error: result.message });
            }
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).send("Internal Server Error");
        }
    });

    // Protected Routes
    app.get('/student', isAuthenticated, (req, res) => res.render('student'));
    app.get('/teacher', isAuthenticated, (req, res) => res.render('teacher'));
    app.get('/counselor', isAuthenticated, (req, res) => res.render('counselor'));
    app.get('/parent', isAuthenticated, (req, res) => res.render('parent'));

    // Connect to database and start server
    connectToDatabase().then(() => {
        app.listen(4000, () => {
            console.log('Server is running on http://localhost:4000/');
        });
    }).catch(error => {
        console.error("Database connection error:", error);
    });
}

// Run setup before starting the server
setup();
