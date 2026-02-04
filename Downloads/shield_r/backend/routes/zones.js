const express = require("express");
const router = express.Router();

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const buildOverpassQuery = (lat, lng, radius) => `
[out:json];
(
  nwr["amenity"~"police|hospital|fire_station|shelter"](around:${radius},${lat},${lng});
  nwr["landuse"="industrial"](around:${radius},${lat},${lng});
  nwr["landuse"="construction"](around:${radius},${lat},${lng});
);
out center 30;
`;

const mapZone = (element) => {
    const tags = element.tags || {};
    const amenity = tags.amenity;
    const landuse = tags.landuse;
    const name = tags.name || tags.operator || "Unnamed area";

    let type = "safe";
    let label = "Safe";

    if (landuse === "industrial") {
        type = "danger";
        label = "Industrial area";
    } else if (landuse === "construction") {
        type = "avoid";
        label = "Construction";
    } else if (amenity) {
        label = amenity.replace(/_/g, " ");
    }

    const lat = element.lat ?? element.center?.lat ?? null;
    const lng = element.lon ?? element.center?.lon ?? null;

    return {
        id: element.id,
        type,
        name,
        category: label,
        lat,
        lng
    };
};

router.get("/", (req, res) => {
    res.json(req.app.locals.store.zones);
});

router.get("/nearby", async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius || 10000);

    console.log(`Fetching zones near ${lat}, ${lng} (radius: ${radius}m)`);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return res.status(400).json({ message: "lat and lng are required" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
        const query = buildOverpassQuery(lat, lng, radius);
        console.log("Sending Overpass query...");

        const response = await fetch(OVERPASS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: query,
            signal: controller.signal
        });

        if (!response.ok) {
            console.error(`Overpass error: ${response.status}`);
            return res.status(502).json({ message: "Overpass API request failed" });
        }

        const data = await response.json();
        const elements = data.elements || [];
        console.log(`Received ${elements.length} zones from Overpass`);

        const zones = elements.map(mapZone).filter((zone) => zone.lat && zone.lng);
        console.log(`Returning ${zones.length} valid zones`);

        res.json(zones);
    } catch (error) {
        console.error("Overpass fetch error:", error.message);

        const allTelanganaZones = [
            // Nagarkurnool District
            { type: "safe", name: "Nagarkurnool District Hospital", category: "Hospital", lat: 16.4833, lng: 78.3167 },
            { type: "safe", name: "Nagarkurnool Police Station", category: "Police", lat: 16.4841, lng: 78.3189 },
            { type: "safe", name: "Nagarkurnool Town Police", category: "Police", lat: 16.4850, lng: 78.3200 },
            { type: "safe", name: "Achampet Police Station", category: "Police", lat: 16.4167, lng: 78.0667 },
            { type: "safe", name: "Kalwakurthy Police Station", category: "Police", lat: 16.6833, lng: 78.0167 },
            { type: "safe", name: "Kalwakurthy Hospital", category: "Hospital", lat: 16.6850, lng: 78.0180 },
            { type: "safe", name: "Wanaparthy Police Station", category: "Police", lat: 16.3667, lng: 78.0667 },
            { type: "safe", name: "Wanaparthy District Hospital", category: "Hospital", lat: 16.3680, lng: 78.0690 },
            { type: "avoid", name: "Nagarkurnool Highway Construction", category: "Construction", lat: 16.4700, lng: 78.3000 },

            // Hyderabad & Surroundings
            { type: "safe", name: "Banjara Hills Police Station", category: "Police", lat: 17.4239, lng: 78.4738 },
            { type: "safe", name: "Gandhi Hospital", category: "Hospital", lat: 17.4416, lng: 78.4983 },
            { type: "safe", name: "NIMS Hospital", category: "Hospital", lat: 17.4313, lng: 78.4099 },
            { type: "safe", name: "Cyberabad Police Station", category: "Police", lat: 17.4435, lng: 78.3772 },
            { type: "danger", name: "Balanagar Industrial Area", category: "Industrial", lat: 17.4887, lng: 78.4412 },
            { type: "safe", name: "Osmania Hospital", category: "Hospital", lat: 17.3753, lng: 78.4815 },
            { type: "avoid", name: "Metro Construction - Ameerpet", category: "Construction", lat: 17.4374, lng: 78.4482 },
            { type: "safe", name: "Punjagutta Police Station", category: "Police", lat: 17.4239, lng: 78.4482 },
            { type: "danger", name: "Jeedimetla Industrial Estate", category: "Industrial", lat: 17.5074, lng: 78.4447 },
            { type: "safe", name: "Care Hospital - Banjara Hills", category: "Hospital", lat: 17.4126, lng: 78.4501 },
            { type: "safe", name: "Secunderabad Railway Police", category: "Police", lat: 17.4400, lng: 78.5018 },
            { type: "safe", name: "Apollo Hospital - Jubilee Hills", category: "Hospital", lat: 17.4326, lng: 78.4071 },
            { type: "avoid", name: "ORR Construction Zone", category: "Construction", lat: 17.3850, lng: 78.4867 },

            // Nalgonda District
            { type: "safe", name: "Nalgonda District Hospital", category: "Hospital", lat: 17.0484, lng: 79.2674 },
            { type: "safe", name: "Nalgonda Police Station", category: "Police", lat: 17.0491, lng: 79.2644 },
            { type: "safe", name: "Nalgonda Town Police", category: "Police", lat: 17.0522, lng: 79.2701 },
            { type: "safe", name: "Miryalaguda Police Station", category: "Police", lat: 16.8767, lng: 79.5662 },
            { type: "safe", name: "Suryapet Government Hospital", category: "Hospital", lat: 17.1489, lng: 79.6237 },
            { type: "safe", name: "Suryapet Police Station", category: "Police", lat: 17.1482, lng: 79.6198 },
            { type: "avoid", name: "Nalgonda Highway Construction", category: "Construction", lat: 17.0300, lng: 79.2500 },

            // Warangal District
            { type: "safe", name: "Warangal Police Station", category: "Police", lat: 17.9689, lng: 79.5941 },
            { type: "safe", name: "MGM Hospital Warangal", category: "Hospital", lat: 17.9784, lng: 79.6008 },
            { type: "safe", name: "Hanamkonda Police Station", category: "Police", lat: 18.0011, lng: 79.5746 },
            { type: "safe", name: "Kakatiya Medical College", category: "Hospital", lat: 18.0034, lng: 79.5827 },

            // Khammam District
            { type: "safe", name: "Khammam District Hospital", category: "Hospital", lat: 17.2473, lng: 80.1514 },
            { type: "safe", name: "Khammam Police Station", category: "Police", lat: 17.2474, lng: 80.1438 },
            { type: "safe", name: "Kothagudem Police Station", category: "Police", lat: 17.5503, lng: 80.6176 },

            // Nizamabad District
            { type: "safe", name: "Nizamabad District Hospital", category: "Hospital", lat: 18.6725, lng: 78.0941 },
            { type: "safe", name: "Nizamabad Police Station", category: "Police", lat: 18.6739, lng: 78.0943 },

            // Karimnagar District
            { type: "safe", name: "Karimnagar Police Station", category: "Police", lat: 18.4386, lng: 79.1288 },
            { type: "safe", name: "Karimnagar District Hospital", category: "Hospital", lat: 18.4391, lng: 79.1250 },

            // Adilabad District
            { type: "safe", name: "Adilabad District Hospital", category: "Hospital", lat: 19.6637, lng: 78.5311 },
            { type: "safe", name: "Adilabad Police Station", category: "Police", lat: 19.6648, lng: 78.5322 },

            // Medak District
            { type: "safe", name: "Sangareddy Police Station", category: "Police", lat: 17.6243, lng: 78.0835 },
            { type: "safe", name: "Sangareddy Hospital", category: "Hospital", lat: 17.6229, lng: 78.0801 },

            // Mahbubnagar District
            { type: "safe", name: "Mahbubnagar District Hospital", category: "Hospital", lat: 16.7488, lng: 77.9816 },
            { type: "safe", name: "Mahbubnagar Police Station", category: "Police", lat: 16.7514, lng: 77.9846 },
            { type: "safe", name: "Gadwal Police Station", category: "Police", lat: 16.2333, lng: 77.8000 },
            { type: "safe", name: "Gadwal Hospital", category: "Hospital", lat: 16.2350, lng: 77.8020 },

            // Rangareddy District
            { type: "safe", name: "LB Nagar Police Station", category: "Police", lat: 17.3523, lng: 78.5528 },
            { type: "safe", name: "Shamshabad Police Station", category: "Police", lat: 17.2403, lng: 78.4294 }
        ];

        const calculateDistance = (lat1, lng1, lat2, lng2) => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c * 1000;
        };

        const nearbyZones = allTelanganaZones
            .map((zone, index) => ({
                ...zone,
                id: 1000 + index,
                distance: calculateDistance(lat, lng, zone.lat, zone.lng)
            }))
            .filter(zone => zone.distance <= radius)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 20);

        console.log(`Using ${nearbyZones.length} nearby fallback zones from Telangana database`);
        res.json(nearbyZones);
    } finally {
        clearTimeout(timeout);
    }
});

module.exports = router;
