// const express = require('express');
// const bodyParser = require('body-parser');
// const db = require('./dataAccess'); // Database connection file
// const path = require('path');

// const app = express();

// // Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static('views')); // Serve static assets like CSS & images

// // Render the login page
// app.get('/login', (req, res) => {
//     res.render('login'); // Renders views/login.ejs
// });

// // Handle login form submission
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     console.log(email,password)
//     const query = "SELECT role FROM Users WHERE email = ? AND password = ?";
//     db.query(query, [email, password], (err, results) => {
//         console.log(results)
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).send("Internal Server Error");
//         }

//         if (results.length > 0) {
//             const role = results[0].role;
//             switch (role) {
//                 case 'student':
//                     return res.redirect('/student_dashboard');
//                 case 'teacher':
//                     return res.redirect('/teacher');
//                 case 'counselor':
//                     return res.redirect('/counselor');
//                 case 'parent':
//                     return res.redirect('/parent');
//                 default:
//                     return res.status(403).send("Unauthorized role.");
//             }
//         } else {
//             return res.render('login', { error: "Invalid email or password" });
//         }
//     });
// });

// // Render role-based pages
// app.get('/student', (req, res) => res.render('student'));
// app.get('/teacher', (req, res) => res.render('teacher'));
// app.get('/counselor', (req, res) => res.render('counselor'));
// app.get('/parent', (req, res) => res.render('parent'));

// // Route for the main page
// app.get('/', (req, res) => {
//     res.render('main'); // Renders views/main.ejs
// });


// const PORT = 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
            return res.redirect(result.redirectUrl);
        } else {
            return res.render('login', { error: result.message });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Dashboard routes
app.get('/student', (req, res) => res.render('student'));
app.get('/teacher', (req, res) => res.render('teacher'));
app.get('/counselor', (req, res) => res.render('counselor'));
app.get('/parent', (req, res) => res.render('parent'));

// Start Express Server
app.listen(4000, () => console.log('Server running on port 4000'));
