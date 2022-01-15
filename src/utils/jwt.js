var jwt = require('jsonwebtoken');

const JWT_ISSUER = process.env.JWT_ISSUER || "none";
const JWT_SECRET = process.env.JWT_SECRET || "123";

/**
 * @param role {string}
 * @param email {string}
 * @param name {string}
 * @returns {string} Created token
 */
function createToken(userid, role, email, name) {
    const payload = {
        sub: userid,
        role: role,
        email: email,
        name: name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h", issuer: JWT_ISSUER });
}

/**
 * @param token {string} Token to verify
 * @returns {{token: object, valid: boolean}} Decoded token
 */
function verifyToken(token){
    try {
        return {
            token: jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER }),
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