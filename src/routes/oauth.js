const express = require('express');
const router = express.Router();
const oauth = require('../utils/googleauth');
const userprofileCollection = require("./../models/userprofile")

router.get("/google/signin", async (req, res) => {
    const token = req.query.token;

    if (token === undefined) {
        res.status(400);
        res.send("Bad Request: Token is missing")
        return;
    }

    const verification = await oauth.verify(token)
    
    if(verification.validToken){
        const profile = await userprofileCollection.findOne({email: email}).exec();
        if(!profile){
            // TODO make an automatic registration
        }
        req.session.signedIn = true;
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