const express = require('express');
const async = require('hbs/lib/async');
const router = express.Router();
const oauth = require('../utils/googleauth');

router.get("google/signin", async (req, res) => {
    const token = req.query.token;
    req.session.uid = 1

    if (token === undefined) {
        res.status(400);
        res.send("Bad Request: Token is missing")
        return;
    }

    const verification = await oauth.verify(token)
    
    if (req.session.signedIn) {
        res.status(200);
        res.send();
    } else {
        req.session.signedIn = true;
        res.status(201);
        res.send(`Welcome ${verification.username}`);
    }

});

router.get("/signout", async (req, res) => {
    req.session.signedIn = false;
    res.status(200);
    res.send("You're now signed out");
});

module.exports = router;