const config = require("../config/config");
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, config.secret_jwt, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
    return;
  });
};
