import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getContacts,
    getHealth,
    getLocation,
    getNearbyZones,
    getSOS,
    getZones,
    triggerSOS,
    updateLocation
} from "../services/api.js";
import SOSButton from "../components/SOSButton.jsx";
import StatusCard from "../components/StatusCard.jsx";

const Dashboard = () => {
    const [location, setLocation] = useState({ lat: null, lng: null, updatedAt: null });
    const [sos, setSos] = useState({ active: false, time: null, lat: null, lng: null });
    const [message, setMessage] = useState("You are safe");
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");
    const [geoStatus, setGeoStatus] = useState("Waiting for device location...");
    const [health, setHealth] = useState("checking");
    const [contactsCount, setContactsCount] = useState(0);
    const [zones, setZones] = useState([]);
    const [lastSync, setLastSync] = useState(null);

    const refresh = async () => {
        setError("");
        try {
            const [locationData, sosData, healthData, contactsData] = await Promise.all([
                getLocation(),
                getSOS(),
                getHealth(),
                getContacts()
            ]);
            setLocation(locationData);
            setSos(sosData);
            setMessage(sosData.active ? "SOS Active" : "You are safe");
            setHealth(healthData.status === "ok" ? "online" : "degraded");
            setContactsCount(contactsData.length || 0);

            const canFetchNearby =
                typeof locationData.lat === "number" && typeof locationData.lng === "number";

            let zonesData = [];
            if (canFetchNearby) {
                try {
                    zonesData = await getNearbyZones(locationData.lat, locationData.lng, 10000);
                } catch {
                    zonesData = await getZones();
                }
            } else {
                zonesData = await getZones();
            }
            setZones(zonesData.slice(0, 3));
            setLastSync(new Date().toISOString());
        } catch (err) {
            setError(err.message || "Unable to reach the backend.");
            setHealth("offline");
        } finally {
            setLoading(false);
        }
    };

    const syncGeolocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported on this device.");
            setGeoStatus("Geolocation not supported.");
            return;
        }
        setSyncing(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const deviceUpdate = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    updatedAt: new Date().toISOString()
                };
                setLocation((prev) => ({ ...prev, ...deviceUpdate }));
                setGeoStatus("Device location captured.");
                try {
                    const updated = await updateLocation({
                        lat: deviceUpdate.lat,
                        lng: deviceUpdate.lng
                    });
                    setLocation(updated);
                } catch (err) {
                    setError(err.message || "Failed to update location.");
                } finally {
                    setSyncing(false);
                }
            },
            () => {
                setError("Unable to access device location.");
                setGeoStatus("Permission denied or unavailable.");
                setSyncing(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000
            }
        );
    };

    useEffect(() => {
        refresh();
        syncGeolocation();
        const interval = setInterval(() => {
            refresh();
            syncGeolocation();
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const handleSOS = async () => {
        setError("");
        try {
            const payload = {
                lat: location.lat,
                lng: location.lng
            };
            await triggerSOS(payload);
            await refresh();
        } catch (err) {
            setError(err.message || "Unable to trigger SOS.");
        }
    };

    return (
        <section className="page">
            <h1>Dashboard</h1>
            <p className="subtitle">Immediate action under stress.</p>

            {error && <div className="error-banner">{error}</div>}

            <div className="toolbar">
                <button className="secondary-button" onClick={refresh} disabled={loading}>
                    {loading ? "Loading..." : "Refresh Status"}
                </button>
                <button className="primary-button" onClick={syncGeolocation} disabled={syncing}>
                    {syncing ? "Updating..." : "Use Device Location"}
                </button>
                <div className={`health-pill health-${health}`}>
                    Backend: {health === "online" ? "Online" : health === "offline" ? "Offline" : "Checking"}
                </div>
            </div>

            <div className="grid">
                <StatusCard title="Status" variant={sos.active ? "danger" : "safe"}>
                    <div className="status-row">
                        <p className="status-text">{message}</p>
                        <span className={`badge ${sos.active ? "badge-danger" : "badge-safe"}`}>
                            {sos.active ? "Active" : "Clear"}
                        </span>
                    </div>
                    <p className="muted">Updated: {sos.time || "—"}</p>
                </StatusCard>

                <StatusCard title="Live Location" variant="info">
                    <p>Lat: {location.lat ?? "—"}</p>
                    <p>Lng: {location.lng ?? "—"}</p>
                    <p className="muted">Last updated: {location.updatedAt || "—"}</p>
                    <p className="muted">{geoStatus}</p>
                </StatusCard>

                <StatusCard title="Emergency Contacts" variant="default">
                    <p className="status-text">{contactsCount}</p>
                    <p className="muted">Trusted contacts saved</p>
                    <Link className="link-button" to="/contacts">
                        Manage contacts
                    </Link>
                </StatusCard>
            </div>

            <div className="sos-area">
                <SOSButton onClick={handleSOS} label="Trigger SOS Now" />
                <p className="muted">Emergency features always visible.</p>
            </div>

            <div className="dashboard-columns">
                <div className="panel">
                    <h3>Nearby Zones</h3>
                    <div className="zone-preview">
                        {zones.length === 0 && <p className="muted">No zones loaded yet.</p>}
                        {zones.map((zone) => (
                            <div key={zone.id} className={`zone-chip zone-${zone.type}`}>
                                {zone.name}
                            </div>
                        ))}
                    </div>
                    <Link className="link-button" to="/zones">
                        View all zones
                    </Link>
                </div>

                <div className="panel">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <Link className="action-card" to="/sos">
                            <strong>Open SOS</strong>
                            <span>One-tap emergency</span>
                        </Link>
                        <Link className="action-card" to="/location">
                            <strong>Location</strong>
                            <span>Update coordinates</span>
                        </Link>
                        <Link className="action-card" to="/settings">
                            <strong>Settings</strong>
                            <span>Alerts & preferences</span>
                        </Link>
                    </div>
                    <p className="muted">Last sync: {lastSync || "—"}</p>
                </div>
            </div>

            <div className="panel">
                <h3>Quick Tips</h3>
                <ul>
                    <li>Keep your device location on for faster SOS response.</li>
                    <li>Verify your emergency contacts regularly.</li>
                    <li>Use the refresh button to sync status.</li>
                </ul>
            </div>
        </section>
    );
};

export default Dashboard;
