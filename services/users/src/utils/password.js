const bcrypt = require('bcryptjs');

const hashPassword = async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
}

const comparePassword = async (inputPassword, userPassword) => {
    return bcrypt.compare(inputPassword, userPassword);
};

module.exports = { hashPassword, comparePassword };
