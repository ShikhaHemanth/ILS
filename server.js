const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const { loginUser } = require('./businessLogic');

const app = express();

// Configure session
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

// Render main page
app.get('/', (req, res) => {
    res.render('main');
});

// Render login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginUser(email, password);
        if (result.success) {
            req.session.userEmail = email; // Store user session
            return res.json({ success: true, redirectUrl: result.redirectUrl });
        } else {
            return res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Dashboard routes
app.get('/student_dashboard', (req, res) => res.render('student_dashboard'));
app.get('/teacher_dashboard', (req, res) => res.render('teacher_dashboard'));
app.get('/counselor_dashboard', (req, res) => res.render('counselor_dashboard'));
app.get('/parent_dashboard', (req, res) => res.render('parent_dashboard'));

// Start Express Server
app.listen(4000, () => console.log('Server running on port 4000'));
