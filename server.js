const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dataAccess'); // Import the database connection
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve static files like HTML

// Login API Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT role FROM Users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
            const role = results[0].role;
            switch (role) {
                case 'student':
                    return res.redirect('/student.html');
                case 'teacher':
                    return res.redirect('/teacher.html');
                case 'counselor':
                    return res.redirect('/counselor.html');
                case 'parent':
                    return res.redirect('/parent.html');
                default:
                    return res.status(403).send("Unauthorized role.");
            }
        } else {
            return res.status(401).send("Invalid email or password.");
        }
    });
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/main.html');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
