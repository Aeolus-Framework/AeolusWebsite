const express = require('express');
const router = express.Router();
const oauth = require('../utils/googleauth');
const userprofileCollection = require("./../models/userprofile")
const jwt = require("../utils/jwt");

router.get("/google/signin", async (req, res) => {
    const token = req.query.token;

    if (token === undefined) {
        return res.status(400).send("Bad Request: Token is missing")
    }

    const verification = await oauth.verify(token)
    
    if(verification.validToken){
        let profile = await userprofileCollection.findOne({email: verification.email, loginProvider: "Google"}).exec();
        if(!profile){
            try {
                profile = await new userprofileCollection({
                    firstname: verification.firstname,
                    lastname: verification.lastname,
                    profilePicture: verification.profilePicture,
                    role: "User",
                    email: verification.email,
                    enabled: true,
                    loginProvider: "Google"
                }).save();
            } catch (error){
                return res.status(500).send("Something went wrong and we were unable to create your profile. Please try again later.");
            }
        }
        req.session.signedIn = true;
        req.session.jwt = jwt.createToken(profile._id, profile.role, profile.email, profile.name);
        res.redirect(302, "/dashboard");
    } else {
        res.status(401).send("Invalid token");
    }
});

router.get("/signout", async (req, res) => {
    req.session.signedIn = false;
    res.status(200);
    res.send("You're now signed out");
});

module.exports = router;
