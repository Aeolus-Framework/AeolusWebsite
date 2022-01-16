const express = require("express");
const router = express.Router();
const userprofileCollection = require("./../models/userprofile");

router.get("/", async (req, res) => {
    let profile = await userprofileCollection.findById({ _id: req.session.profile._id }).exec();

    if (!profile) {
        return res.status(404).send("The requested profile could not be found");
    }

    res.render("userprofile", { profile: req.session.profile });
});

module.exports = router;
