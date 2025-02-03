// const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./dataAccess');

async function loginUser(email, password) {
    try {
        const userData = await getUserByEmail(email);
        if (!userData) {
            return { success: false, message: 'Invalid credentials' };
        }

        const real_password = userData.password;
        const role = userData.role;

        // const result = await bcrypt.compare(password, real_password);
        if (password == real_password) {
            let redirectUrl;
            switch (role) {
                case 'student': redirectUrl = '/student_dashboard'; break;
                case 'teacher': redirectUrl = '/teacher'; break;
                case 'counselor': redirectUrl = '/counselor'; break;
                case 'parent': redirectUrl = '/parent'; break;
                default: redirectUrl = '/';
            }
            return { success: true, message: 'Login successful', redirectUrl };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { loginUser };
