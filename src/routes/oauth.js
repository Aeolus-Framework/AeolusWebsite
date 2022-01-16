const express = require("express");
const router = express.Router();
const oauth = require("../utils/googleauth");
const userprofileCollection = require("./../models/userprofile");
const validator = require("validator");
const jwt = require("../utils/jwt");
const { redirect } = require("express/lib/response");

const loginProviders = ["Google"];

router.get("/google/signin", async (req, res) => {
    const token = req.query.token;

    if (token === undefined) {
        return res.status(400).send("Bad Request: Token is missing");
    }

    const verification = await oauth.verify(token);
    if (verification.validToken) {
        let profile = await userprofileCollection
            .findOne({ email: verification.email, loginProvider: "Google" })
            .exec();

        if (!profile) {
            verification.loginProvider = "Google";
            return renderRegisterPage(res, verification);
        }

        if (!profile.enabled || new Date() <= profile.disabledUntil) {
            return res.status(403).send("Your account has been disabled");
        }

        req.session.signedIn = true;
        req.session.profile = profile;
        req.session.jwt = jwt.createToken(profile._id, profile.role, profile.email, profile.name);

        if (profile.role === "Admin") {
            res.redirect(302, "/admin");
        } else {
            res.redirect(302, "/dashboard");
        }
    } else {
        res.status(401).send("Invalid token");
    }
});

router.post("/signup", async (req, res) => {
    const profilePicture = req.body.profilePicture;
    const loginProvider = req.body.loginProvider;
    const firstname = req.body.firstname || "";
    const lastname = req.body.lastname || "";
    const email = req.body.email || "";

    let error = false;
    if (!loginProviders.includes(loginProvider)) error = true;
    if (validator.isEmpty(firstname)) error = true;
    if (validator.isEmpty(lastname)) error = true;
    if (!validator.isEmail(email)) error = true;

    if (error) return renderRegisterPage(res, req.body, error);

    try {
        profile = await new userprofileCollection({
            firstname: firstname,
            lastname: lastname,
            profilePicture: profilePicture,
            role: "User",
            email: email,
            enabled: true,
            loginProvider: loginProvider
        }).save();
    } catch (error) {
        return renderRegisterPage(res, req.body, [
            "Something went wrong and we were unable to create your profile. Please try again later."
        ]);
    }
    req.session.signedIn = true;
    req.session.profile = profile;
    req.session.jwt = jwt.createToken(profile._id, profile.role, profile.email, profile.name);
    res.redirect(302, "/dashboard");
});

router.get("/signout", async (req, res) => {
    req.session.destroy();
    res.render("signout", {
        layout: "layout_empty",
        metaTags: [{ name: "google-signin-client_id", content: oauth.GOOGLE_CLIENT_ID }]
    });
});

module.exports = router;

/**
 *
 * @param {object} res
 * @param {object} profile
 * @param {boolean?} error
 */
function renderRegisterPage(res, profile, error = false) {
    res.render("signup", {
        layout: "layout_empty",
        profile,
        error,
        metaTags: [{ name: "google-signin-client_id", content: oauth.GOOGLE_CLIENT_ID }]
    });
}
