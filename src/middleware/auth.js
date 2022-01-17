const jwt = require("../utils/jwt");

/**
 * Authenticate a JSON web token.
 * @param req Request object
 * @param res Response object
 * @param next Next function to run after middleware function finishes
 * If the token is valid, `next` function will execute and a user object with `role` and `uid` will be assigned to `req` parameter.
 *
 * If no token was found in the authorization header or was invalid, HTTP status code 401 is returned.
 */
function authenticate(req, res, next) {
    const token = req.session.jwt;
    const isSignedIn = req.session?.signedIn === true;

    if (!token || !isSignedIn) return res.status(401).send();

    const tokenVerification = jwt.verifyToken(token);
    if (!tokenVerification.valid) {
        return res.status(401).send();
    }

    req.user = {
        uid: tokenVerification.token.sub,
        role: tokenVerification.token.role
    };
    next();
}

function authorize(...roles) {
    return (req, res, next) => {
        const { user } = req;

        if (user && roles.map(v => v.toLowerCase()).includes(user.role?.toLowerCase())) next();
        else return res.status(403).send();
    };
}

module.exports = { authenticate, authorize };
