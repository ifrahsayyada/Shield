import { useEffect, useState, useRef } from "react";
import { getNearbyZones, getZones } from "../services/api.js";

const typeLabels = {
    safe: "Safe",
    avoid: "Avoid"
};

const typeEmojis = {
    safe: "🛡️",
    avoid: "🚫"
};

const typeColors = {
    safe: "#4caf50",
    avoid: "#e53935"
};

const Zones = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [source, setSource] = useState("demo");
    const [radius, setRadius] = useState(10000);
    const [deviceLocation, setDeviceLocation] = useState({ lat: null, lng: null });
    const [selectedZone, setSelectedZone] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // grid or map
    const [filterType, setFilterType] = useState("all");
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const loadDemoZones = async () => {
        setError("");
        setLoading(true);
        try {
            const data = await getZones();
            setZones(data);
            setSource("demo");
        } catch (err) {
            setError(err.message || "Unable to load zones.");
        } finally {
            setLoading(false);
        }
    };

    const loadNearbyZones = () => {
        setError("");
        setLoading(true);

        if (!navigator.geolocation) {
            setError("Geolocation not supported.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setDeviceLocation({ lat, lng });
                    console.log(`Fetching zones near ${lat}, ${lng}`);
                    const data = await getNearbyZones(lat, lng, radius);
                    console.log(`Received ${data.length} zones`);
                    setZones(data);
                    setSource("live");
                    if (data.length === 0) {
                        setError("No zones found nearby. Try increasing the radius.");
                    }
                } catch (err) {
                    console.error("Zone fetch error:", err);
                    setError(err.message || "Unable to fetch nearby zones. Loading demo zones instead.");
                    loadDemoZones();
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Unable to access device location.");
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000
            }
        );
    };

    useEffect(() => {
        loadDemoZones();
    }, []);

    useEffect(() => {
        if (viewMode === "map" && deviceLocation.lat && deviceLocation.lng) {
            initializeMap();
        }
    }, [viewMode, zones, deviceLocation]);

    const initializeMap = () => {
        if (!mapContainerRef.current) return;

        // Clear existing map
        mapContainerRef.current.innerHTML = `
            <div class="map-placeholder">
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${deviceLocation.lng - 0.05},${deviceLocation.lat - 0.05},${deviceLocation.lng + 0.05},${deviceLocation.lat + 0.05}&layer=mapnik&marker=${deviceLocation.lat},${deviceLocation.lng}"
                    style="border: none; border-radius: 12px;">
                </iframe>
            </div>
        `;
    };

    const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    const openInMaps = (lat, lng, name) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    };

    const getDirections = (lat, lng) => {
        if (deviceLocation.lat && deviceLocation.lng) {
            const url = `https://www.google.com/maps/dir/${deviceLocation.lat},${deviceLocation.lng}/${lat},${lng}`;
            window.open(url, '_blank');
        } else {
            alert("Please enable location to get directions");
        }
    };

    const filteredZones = filterType === "all"
        ? zones
        : zones.filter(zone => zone.type === filterType);

    const zoneStats = {
        total: zones.length,
        safe: zones.filter(z => z.type === "safe").length,
        avoid: zones.filter(z => z.type === "avoid").length
    };

    return (
        <section className="zones-page">
            <div className="zones-header">
                <div>
                    <h1>🗺️ Safety Zones</h1>
                    <p className="subtitle">Discover safe and danger zones near you</p>
                </div>
            </div>

            {error && <div className="error-banner">⚠️ {error}</div>}

            {/* Zone Statistics */}
            {zones.length > 0 && (
                <div className="zone-stats">
                    <div className="zone-stat-card" style={{ borderColor: '#4a5d23' }}>
                        <span className="zone-stat-icon">📍</span>
                        <div>
                            <p className="zone-stat-value">{zoneStats.total}</p>
                            <p className="zone-stat-label">Total Zones</p>
                        </div>
                    </div>
                    <div className="zone-stat-card" style={{ borderColor: typeColors.safe }}>
                        <span className="zone-stat-icon">{typeEmojis.safe}</span>
                        <div>
                            <p className="zone-stat-value">{zoneStats.safe}</p>
                            <p className="zone-stat-label">Safe Zones</p>
                        </div>
                    </div>
                    <div className="zone-stat-card" style={{ borderColor: typeColors.avoid }}>
                        <span className="zone-stat-icon">{typeEmojis.avoid}</span>
                        <div>
                            <p className="zone-stat-value">{zoneStats.avoid}</p>
                            <p className="zone-stat-label">Avoid Zones</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Section */}
            <div className="zones-controls">
                <div className="control-group">
                    <button
                        className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        📋 Grid View
                    </button>
                    <button
                        className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                        onClick={() => setViewMode('map')}
                    >
                        🗺️ Map View
                    </button>
                </div>

                <div className="control-group">
                    <button className="primary-button" onClick={loadNearbyZones} disabled={loading}>
                        {loading ? "⏳ Loading..." : "📍 Load Nearby Zones"}
                    </button>
                    <button className="secondary-button" onClick={loadDemoZones}>
                        🎯 Demo Zones
                    </button>
                </div>

                <div className="control-group">
                    <label className="select-label">
                        🎯 Radius
                        <select
                            className="select"
                            value={radius}
                            onChange={(event) => setRadius(Number(event.target.value))}
                        >
                            <option value={5000}>5 km</option>
                            <option value={10000}>10 km</option>
                            <option value={15000}>15 km</option>
                            <option value={20000}>20 km</option>
                        </select>
                    </label>

                    <label className="select-label">
                        🔍 Filter
                        <select
                            className="select"
                            value={filterType}
                            onChange={(event) => setFilterType(event.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="safe">🛡️ Safe Only</option>
                            <option value="avoid">🚫 Avoid Only</option>
                        </select>
                    </label>
                </div>
            </div>

            {source === "live" && deviceLocation.lat && (
                <div className="location-info-banner">
                    📍 Using your location: {deviceLocation.lat.toFixed(4)}, {deviceLocation.lng.toFixed(4)}
                </div>
            )}

            {loading && <p className="loading-text">⏳ Loading zones...</p>}

            {/* Map View */}
            {viewMode === "map" && !loading && (
                <div className="map-section">
                    <div ref={mapContainerRef} className="map-container">
                        {!deviceLocation.lat ? (
                            <div className="map-placeholder-info">
                                <span style={{ fontSize: "3rem" }}>📍</span>
                                <p>Load nearby zones to view map</p>
                            </div>
                        ) : null}
                    </div>
                    <div className="map-legend">
                        <h3>Map Legend</h3>
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: typeColors.safe }}></span>
                            <span>{typeEmojis.safe} Safe Zones</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ background: typeColors.avoid }}></span>
                            <span>{typeEmojis.avoid} Avoid Zones</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && !loading && (
                <>
                    {filteredZones.length === 0 ? (
                        <div className="empty-zones-state">
                            <span style={{ fontSize: "4rem" }}>🗺️</span>
                            <h2>No zones found</h2>
                            <p>Try a different radius or load demo zones</p>
                        </div>
                    ) : (
                        <div className="zones-grid">
                            {filteredZones.map((zone) => (
                                <div key={zone.id} className={`zone-card-enhanced zone-${zone.type}`}>
                                    <div className="zone-type-indicator" style={{ background: typeColors[zone.type] }}>
                                        <span className="zone-emoji">{typeEmojis[zone.type]}</span>
                                    </div>

                                    <div className="zone-content">
                                        <div className="zone-header-enhanced">
                                            <h3>{zone.name}</h3>
                                            <span className={`badge-enhanced badge-${zone.type}`}>
                                                {typeLabels[zone.type] || "Unknown"}
                                            </span>
                                        </div>

                                        <p className="zone-category">
                                            🏷️ {zone.category || "General area"}
                                        </p>

                                        {zone.lat && zone.lng && (
                                            <>
                                                <p className="zone-coordinates">
                                                    📍 {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                                                </p>

                                                {deviceLocation.lat && (
                                                    <p className="zone-distance">
                                                        📏 {getDistance(deviceLocation.lat, deviceLocation.lng, zone.lat, zone.lng)} km away
                                                    </p>
                                                )}

                                                <div className="zone-actions">
                                                    <button
                                                        className="zone-action-btn map-btn"
                                                        onClick={() => openInMaps(zone.lat, zone.lng, zone.name)}
                                                        title="Open in Google Maps"
                                                    >
                                                        🗺️ View
                                                    </button>
                                                    {deviceLocation.lat && (
                                                        <button
                                                            className="zone-action-btn directions-btn"
                                                            onClick={() => getDirections(zone.lat, zone.lng)}
                                                            title="Get directions"
                                                        >
                                                            🧭 Directions
                                                        </button>
                                                    )}
                                                    <button
                                                        className="zone-action-btn info-btn"
                                                        onClick={() => setSelectedZone(zone)}
                                                        title="More info"
                                                    >
                                                        ℹ️
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Zone Detail Modal */}
            {selectedZone && (
                <div className="zone-modal-overlay" onClick={() => setSelectedZone(null)}>
                    <div className="zone-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedZone(null)}>✕</button>

                        <div className="modal-header" style={{ background: typeColors[selectedZone.type] }}>
                            <span className="modal-emoji">{typeEmojis[selectedZone.type]}</span>
                            <h2>{selectedZone.name}</h2>
                            <span className="modal-badge">{typeLabels[selectedZone.type]}</span>
                        </div>

                        <div className="modal-body">
                            <div className="modal-info-row">
                                <strong>🏷️ Category:</strong>
                                <span>{selectedZone.category || "General area"}</span>
                            </div>

                            {selectedZone.lat && selectedZone.lng && (
                                <>
                                    <div className="modal-info-row">
                                        <strong>📍 Coordinates:</strong>
                                        <span>{selectedZone.lat.toFixed(6)}, {selectedZone.lng.toFixed(6)}</span>
                                    </div>

                                    {deviceLocation.lat && (
                                        <div className="modal-info-row">
                                            <strong>📏 Distance:</strong>
                                            <span>{getDistance(deviceLocation.lat, deviceLocation.lng, selectedZone.lat, selectedZone.lng)} km from you</span>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="modal-actions">
                                <button
                                    className="modal-action-btn"
                                    onClick={() => openInMaps(selectedZone.lat, selectedZone.lng, selectedZone.name)}
                                >
                                    🗺️ Open in Maps
                                </button>
                                {deviceLocation.lat && (
                                    <button
                                        className="modal-action-btn"
                                        onClick={() => getDirections(selectedZone.lat, selectedZone.lng)}
                                    >
                                        🧭 Get Directions
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tips Section */}
            <div className="zones-tips-section">
                <h2>💡 Safety Zone Tips</h2>
                <div className="tips-grid">
                    <div className="tip-card">
                        <span className="tip-icon">🛡️</span>
                        <h3>Safe Zones</h3>
                        <p>Areas with good lighting, high foot traffic, and emergency services nearby</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🚫</span>
                        <h3>Avoid Zones</h3>
                        <p>High-risk areas - plan alternative routes when possible</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">📱</span>
                        <h3>Stay Connected</h3>
                        <p>Share your location with trusted contacts when entering new areas</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Zones;
