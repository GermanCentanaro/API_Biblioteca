const express = require("express");
const helmet = require("helmet");

const users = require("./users/router");
const books = require("./books/router");

const {config} = require("../config");

const router = express.Router();

router.use(helmet());
router.use("/users", users);
router.use("/books", books);

module.exports = router;
