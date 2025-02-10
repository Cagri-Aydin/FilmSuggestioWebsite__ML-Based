const User = require('../models/user');

const getUserById = async (id) => {
    try {
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        throw new Error('Error fetching user');
    }
};

module.exports = { getUserById };
