const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./dataAccess');

async function loginUser(email, password) {
    try {
        const userData = await getUserByEmail(email);
        if (!userData) {
            return { success: false, message: 'Invalid credentials' };
        }

        const hashedPassword = userData.password;
        const role = userData.role;

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashedPassword, function(err, result) {
                if (err) {
                    reject('An error occurred while comparing passwords.');
                }
                if (result) {
                    let redirectUrl;
                    switch (role) {
                        case 'student': redirectUrl = '/student_dashboard'; break;
                        case 'teacher': redirectUrl = '/teacher_dashboard'; break;
                        case 'counselor': redirectUrl = '/counselor_dashboard'; break;
                        case 'parent': redirectUrl = '/parent_dashboard'; break;
                        default: redirectUrl = '/';
                    }
                    resolve({ success: true, message: 'Login successful', redirectUrl, userId: userData.userID });
                } else {
                    resolve({ success: false, message: 'Invalid credentials' });
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

module.exports = { loginUser };
