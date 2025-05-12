const express = require('express');
const { createBook, findBook, updateBook,removeBook, findBooksByFilter  } = require('./controller');
const {authenticator} = require("../middleware/authenticator");
const {booksAuthorization} = require("../middleware/authorization");
const { logger } = require("../middleware/logger");

const router = express.Router();

router.use(logger);

router
    .route("/")
    .post(authenticator, booksAuthorization, createBook)
    .get(authenticator, findBooksByFilter)

router
    .route("/id")
    .get(authenticator, findBook)
    .put(authenticator, booksAuthorization, updateBook)
    .delete(authenticator, booksAuthorization, removeBook);

module.exports = router;