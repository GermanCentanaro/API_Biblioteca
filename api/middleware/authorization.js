
const e = require("express");
const { isUserAdmin } = require("../services/userService");

const usersAuthorization = async (req, res, next) => {
  const { userId } = req.body;
  const id = req.params.id || req.body.id;

  const isFree = await isUserAdmin(userId);

  if (isFree || id === userId) {
    next();
  } else {
    return res.status(403).json({
      message: "usuario no autorizado",
    });
  }
};

const booksAuthorization = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const { userId } = req.body;

  const isAdmin = await isUserAdmin(userId);

  if (isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: locale.translate("errors.operationNotAllowed"),
    });
  }
}

module.exports = { usersAuthorization, booksAuthorization };