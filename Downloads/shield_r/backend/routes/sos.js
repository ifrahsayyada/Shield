const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const { sos } = req.app.locals.store;
    res.json(sos);
});

router.post("/", (req, res) => {
    const { lat, lng } = req.body || {};
    const time = new Date().toISOString();
    req.app.locals.store.sos = {
        active: true,
        time,
        lat: typeof lat === "number" ? lat : null,
        lng: typeof lng === "number" ? lng : null
    };
    res.json({ status: "SOS triggered", time });
});

router.post("/resolve", (req, res) => {
    const time = new Date().toISOString();
    req.app.locals.store.sos = {
        active: false,
        time,
        lat: null,
        lng: null
    };
    res.json({ status: "SOS resolved", time });
});

module.exports = router;
