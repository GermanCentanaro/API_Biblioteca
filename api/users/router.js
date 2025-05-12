const express = require('express');
const { create, login, update, remove } = require("./controller");
const { authenticator } = require("../middleware/authenticator");
const { logger } = require("../middleware/logger");
const { usersAuthorization } = require("../middleware/authorization");

const router = express.Router();

router.use(logger);

router
    .route("/")
    .post(create)
    .put(authenticator, usersAuthorization, update)
    .delete(authenticator, usersAuthorization, remove);

router.route("/login"). post(login)

module.exports = router;
