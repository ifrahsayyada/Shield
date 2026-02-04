const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json(req.app.locals.store.location);
});

router.post("/", (req, res) => {
    const { lat, lng } = req.body || {};
    const updatedAt = new Date().toISOString();

    req.app.locals.store.location = {
        lat: typeof lat === "number" ? lat : null,
        lng: typeof lng === "number" ? lng : null,
        updatedAt
    };

    res.json(req.app.locals.store.location);
});

module.exports = router;
