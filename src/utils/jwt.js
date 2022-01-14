var jwt = require('jsonwebtoken');

const JWT_ISSUER = process.env.JWT_ISSUER || "none";
const JWT_SECRET = process.env.JWT_SECRET || "123";

/**
 * @param role {string}
 * @param email {string}
 * @param name {string}
 * @returns {string} Created token
 */
function createToken(role, email, name){
    const payload = {
        role = role,
        email = email,
        name = name,
        issuer = JWT_ISSUER,
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

/**
 * @param token {string} Token to verify
 * @returns {{token: object, valid: boolean}} Decoded token
 */
function verifyToken(token){
    try {
        return {
            token: jwt.verify(token, JWT_SECRET),
            valid: true
        };
    } catch (error) {
        return {
            token: undefined,
            valid: false
        };
    }
}

module.exports = { createToken, verifyToken };