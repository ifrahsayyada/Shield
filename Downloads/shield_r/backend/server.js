const express = require("express");
const cors = require("cors");

const sosRoutes = require("./routes/sos");
const locationRoutes = require("./routes/location");
const contactsRoutes = require("./routes/contacts");
const zonesRoutes = require("./routes/zones");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.locals.store = {
    sos: {
        active: false,
        time: null,
        lat: null,
        lng: null
    },
    location: {
        lat: null,
        lng: null,
        updatedAt: null
    },
    contacts: [],
    zones: [
        { id: 1, type: "safe", name: "Nagarkurnool District Hospital", category: "Hospital", lat: 16.4833, lng: 78.3167 },
        { id: 2, type: "safe", name: "Nagarkurnool Police Station", category: "Police", lat: 16.4841, lng: 78.3189 },
        { id: 3, type: "safe", name: "Wanaparthy Police Station", category: "Police", lat: 16.3667, lng: 78.0667 },
        { id: 4, type: "safe", name: "Kalwakurthy Hospital", category: "Hospital", lat: 16.6850, lng: 78.0180 },
        { id: 5, type: "safe", name: "Mahbubnagar District Hospital", category: "Hospital", lat: 16.7488, lng: 77.9816 },
        { id: 6, type: "safe", name: "Gadwal Police Station", category: "Police", lat: 16.2333, lng: 77.8000 },
        { id: 7, type: "safe", name: "Nalgonda District Hospital", category: "Hospital", lat: 17.0484, lng: 79.2674 },
        { id: 8, type: "safe", name: "Gandhi Hospital Hyderabad", category: "Hospital", lat: 17.4416, lng: 78.4983 },
        { id: 9, type: "safe", name: "Warangal Police Station", category: "Police", lat: 17.9689, lng: 79.5941 },
        { id: 10, type: "avoid", name: "Nagarkurnool Highway Construction", category: "Construction", lat: 16.4700, lng: 78.3000 },
        { id: 11, type: "safe", name: "Achampet Police Station", category: "Police", lat: 16.4167, lng: 78.0667 },
        { id: 12, type: "safe", name: "Karimnagar Police Station", category: "Police", lat: 18.4386, lng: 79.1288 }
    ]
};

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Backend running" });
});

app.use("/sos", sosRoutes);
app.use("/location", locationRoutes);
app.use("/contacts", contactsRoutes);
app.use("/zones", zonesRoutes);

app.listen(PORT, () => {
    console.log(`SHIELD_R backend running on port ${PORT}`);
});
