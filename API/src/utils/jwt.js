const jwt = require("jsonwebtoken");

exports.signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
