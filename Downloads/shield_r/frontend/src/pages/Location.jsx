import { useEffect, useState } from "react";
import { getLocation, updateLocation } from "../services/api.js";
import StatusCard from "../components/StatusCard.jsx";

const getDirection = (heading) => {
    if (heading === null) return "";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
};

const Location = () => {
    const [location, setLocation] = useState({ lat: null, lng: null, updatedAt: null });
    const [message, setMessage] = useState("Location ready.");
    const [error, setError] = useState("");
    const [areaName, setAreaName] = useState("Loading...");
    const [accuracy, setAccuracy] = useState(null);
    const [altitude, setAltitude] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [heading, setHeading] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAreaName = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            if (data.address) {
                const parts = [];
                if (data.address.suburb || data.address.neighbourhood) {
                    parts.push(data.address.suburb || data.address.neighbourhood);
                }
                if (data.address.city || data.address.town || data.address.village) {
                    parts.push(data.address.city || data.address.town || data.address.village);
                }
                if (data.address.state) {
                    parts.push(data.address.state);
                }
                if (data.address.country) {
                    parts.push(data.address.country);
                }
                setAreaName(parts.join(", ") || data.display_name || "Unknown Location");
            } else {
                setAreaName("Unknown Location");
            }
        } catch (err) {
            console.error("Error fetching area name:", err);
            setAreaName("Unable to fetch location name");
        }
    };

    const refresh = async () => {
        setError("");
        setIsLoading(true);
        try {
            const data = await getLocation();
            setLocation(data);
            if (data.lat && data.lng) {
                await fetchAreaName(data.lat, data.lng);
            }
        } catch (err) {
            setError(err.message || "Unable to load location.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateFromDevice = () => {
        setError("");
        setIsLoading(true);
        if (!navigator.geolocation) {
            setMessage("Geolocation not supported.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("Full position data:", position);

                const deviceUpdate = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    updatedAt: new Date().toISOString()
                };

                // Extract all available position data
                setAccuracy(position.coords.accuracy || null);
                setAltitude(position.coords.altitude !== null ? position.coords.altitude : null);
                setSpeed(position.coords.speed !== null ? position.coords.speed : null);
                setHeading(position.coords.heading !== null ? position.coords.heading : null);

                console.log("Location details:", {
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    speed: position.coords.speed,
                    heading: position.coords.heading
                });

                setLocation((prev) => ({ ...prev, ...deviceUpdate }));

                try {
                    const data = await updateLocation({
                        lat: deviceUpdate.lat,
                        lng: deviceUpdate.lng
                    });
                    setLocation(data);
                    await fetchAreaName(deviceUpdate.lat, deviceUpdate.lng);
                    setMessage("✅ Location updated successfully!");
                } catch (err) {
                    setError(err.message || "Failed to update location.");
                } finally {
                    setIsLoading(false);
                }
            },
            (err) => {
                setMessage("❌ Unable to access device location.");
                setError(err.message || "Location access denied");
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    const openInMaps = () => {
        if (location.lat && location.lng) {
            window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
        }
    };

    const copyCoordinates = () => {
        if (location.lat && location.lng) {
            const coords = `${location.lat}, ${location.lng}`;
            navigator.clipboard.writeText(coords);
            setMessage("📋 Coordinates copied to clipboard!");
        }
    };

    useEffect(() => {
        refresh();
        updateFromDevice();
    }, []);

    return (
        <section className="page location-page">
            <div className="location-header">
                <h1>📍 Location Tracking</h1>
                <p className="subtitle">Real-time GPS tracking with detailed location information</p>
            </div>

            {error && <div className="error-banner">⚠️ {error}</div>}

            {/* Area Name Display */}
            {location.lat && location.lng && (
                <div className="area-name-card">
                    <div className="area-icon">🗺️</div>
                    <div className="area-details">
                        <h2>{areaName}</h2>
                        <p className="area-coords">
                            {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
                        </p>
                    </div>
                </div>
            )}

            {/* Main Location Cards */}
            <div className="grid">
                <StatusCard title="GPS Coordinates" variant="info">
                    <div className="coord-display">
                        <div className="coord-item">
                            <span className="coord-label">Latitude</span>
                            <span className="coord-value">{location.lat?.toFixed(6) ?? "—"}</span>
                        </div>
                        <div className="coord-item">
                            <span className="coord-label">Longitude</span>
                            <span className="coord-value">{location.lng?.toFixed(6) ?? "—"}</span>
                        </div>
                    </div>
                    {location.updatedAt && (
                        <p className="muted" style={{ marginTop: '1rem' }}>
                            Last updated: {new Date(location.updatedAt).toLocaleString()}
                        </p>
                    )}
                </StatusCard>

                <StatusCard title="Location Details" variant="default">
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-icon">🎯</span>
                            <div>
                                <p className="detail-label">Accuracy</p>
                                <p className="detail-value">
                                    {accuracy ? `±${accuracy.toFixed(0)}m` : "Calculating..."}
                                </p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">⛰️</span>
                            <div>
                                <p className="detail-label">Altitude</p>
                                <p className="detail-value">
                                    {altitude !== null ? `${altitude.toFixed(1)}m` : "Not available"}
                                </p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🏃</span>
                            <div>
                                <p className="detail-label">Speed</p>
                                <p className="detail-value">
                                    {speed !== null && speed > 0 ? `${(speed * 3.6).toFixed(1)} km/h` : "Stationary"}
                                </p>
                            </div>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🧭</span>
                            <div>
                                <p className="detail-label">Heading</p>
                                <p className="detail-value">
                                    {heading !== null ? `${heading.toFixed(0)}° ${getDirection(heading)}` : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </StatusCard>
            </div>

            {/* Action Buttons */}
            <div className="location-actions">
                <button
                    className="primary-button"
                    onClick={updateFromDevice}
                    disabled={isLoading}
                >
                    {isLoading ? "⏳ Updating..." : "🔄 Refresh from Device"}
                </button>
                <button
                    className="secondary-button"
                    onClick={openInMaps}
                    disabled={!location.lat || !location.lng}
                >
                    🗺️ Open in Maps
                </button>
                <button
                    className="secondary-button"
                    onClick={copyCoordinates}
                    disabled={!location.lat || !location.lng}
                >
                    📋 Copy Coordinates
                </button>
            </div>

            {message && (
                <div className="location-message">
                    <p>{message}</p>
                </div>
            )}

            {/* Location Info Section */}
            <div className="location-info-section">
                <h2>ℹ️ About Location Tracking</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <span className="info-icon">🔒</span>
                        <h3>Privacy First</h3>
                        <p>Your location is only shared with your emergency contacts when you trigger SOS</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">⚡</span>
                        <h3>Real-Time Updates</h3>
                        <p>Location updates in real-time using high-accuracy GPS sensors</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon">🌐</span>
                        <h3>Global Coverage</h3>
                        <p>Works anywhere with GPS signal and internet connectivity</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
