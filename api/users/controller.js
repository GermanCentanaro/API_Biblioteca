const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUserById } = require("../services/userService");
const { config } = require("../../config");

const User = require("./model");

const create = async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log("Body: ", req.body);

    const findUser = await User.find({ $or: [{ username }, { email }] });
    if (findUser.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = {
        name,
        email,
        username,
        password
    };

    const newUser = new User(user);
    newUser.save().then((userCreated) => {
        res.status(200).json(userCreated)
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
        return res.status(500).json({ message: "User not exists" });
    } else {
        const userId = foundUser._id;
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(500).json({ message: "User not founded" });
        }else {
            const token = jwt.sign({ userId }, config.jwtKey, { expiresIn: "6h" });
            return res.status(200).json({ 
                data: {
                    username: foundUser.username,
                    name: foundUser.name,
                    token
                },
                message: "Login success"
            });
        }
    }
};

const update = async (req, res) => {
    const id = req.query.id;
    const { name, email, username, password } = req.body;

    if (name && email && username && password) {
        const user = {
            name,
            email,
            username,
            password
        };

        const userFind = await findUserById(id);

        if (!userFind) {
            return res.status(404).json({ message: "User not found" });
        } else {
            const userUpdated = await User.updateOne(
                { _id: userFind._id },
                { $set: { name: user.name, email: user.email, password: user.password } }
            );

            if (userUpdated.ok === 1) {
                return res.status(200).json({ message: "User updated successfully" });
            } else {
                return res.status(500).json({ message: "Error updating user" });
            }
        }
    } else {
        return res.status(400).json({ message: "All fields are required" });
    }
    
};

const remove = async (req, res) => {
    const id = req.body.id;
    const userFind = await findUserById(id);
    console.log("UserFind: ", userFind);
    if (!userFind) {
        return res.status(404).json({ message: "User not found" });
    } else {
        const softDeleteResult = await User.updateOne(
            { _id: userFind._id },
            { 
                $set: { 
                    password: userFind.password ,isDeleted: true
                } 
            }
        );

        if (softDeleteResult.ok === 1) {
            return res.status(200).json({ message: "User deleted successfully" });
        } else {
            return res.status(500).json({ message: "Error deleting user" });
        }
    }
}

module.exports = {
    create,
    login,
    update,
    remove
};