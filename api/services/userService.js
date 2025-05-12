const User = require("../users/model");

// Find User by Id
const findUserById = async (id) => {
    console.log("Finding user by ID:", id);
    const userFound = await User.findOne({ _id: id })
    .then((user) => {
        return user;
    })
    .catch((error) => {
        console.error("Error finding user by ID:", error);
    });
  
    return userFound;
};

const isUserAdmin = async (userId) => {
    try {
        const isAdmin = await User.find({
            _id: userId,
            perms: { $in: ["updateEditor", "DeleteEditor"] },
        });

        if (isAdmin.length > 0) {
            return true;
        }else {
            return false;
        }
    } catch (error) {
        console.error("Error checking if user is admin:", error);
        return false;
    }
};

module.exports = {
    findUserById,
    isUserAdmin
};