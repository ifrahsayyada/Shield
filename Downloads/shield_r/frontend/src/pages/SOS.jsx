import { useEffect, useState } from "react";
import { getLocation, getSOS, resolveSOS, triggerSOS, getContacts } from "../services/api.js";
import SOSButton from "../components/SOSButton.jsx";
import StatusCard from "../components/StatusCard.jsx";

const SOS = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [sos, setSos] = useState({ active: false, time: null, lat: null, lng: null });
    const [contacts, setContacts] = useState([]);
    const [note, setNote] = useState("Ready to help fast.");
    const [sosMessage, setSosMessage] = useState("");
    const [countdown, setCountdown] = useState(null);
    const [autoSendEnabled, setAutoSendEnabled] = useState(false);

    const refresh = async () => {
        const [locationData, sosData, contactsData] = await Promise.all([
            getLocation(),
            getSOS(),
            getContacts()
        ]);
        setLocation(locationData);
        setSos(sosData);
        setContacts(contactsData || []);
    };

    useEffect(() => {
        refresh();
        syncGeolocation();
    }, []);

    const syncGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error("Geolocation error:", error),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    };

    const handleTrigger = async () => {
        await triggerSOS({ lat: location.lat, lng: location.lng, message: sosMessage });
        setNote("🚨 SOS triggered! Emergency contacts notified. Stay calm, help is on the way.");
        await refresh();
    };

    const handleQuickTrigger = () => {
        setCountdown(5);
        setAutoSendEnabled(true);
    };

    const cancelCountdown = () => {
        setCountdown(null);
        setAutoSendEnabled(false);
    };

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            handleTrigger();
            setCountdown(null);
            setAutoSendEnabled(false);
        }
    }, [countdown]);

    const handleResolve = async () => {
        await resolveSOS();
        setNote("✅ SOS resolved. Stay safe!");
        setSosMessage("");
        await refresh();
    };

    const handleCallPolice = () => {
        window.location.href = "tel:100";
    };

    const handleCallAmbulance = () => {
        window.location.href = "tel:108";
    };

    const handleCallWomenHelpline = () => {
        window.location.href = "tel:1091";
    };

    const shareLocation = () => {
        if (location.lat && location.lng) {
            const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
            if (navigator.share) {
                navigator.share({
                    title: '🚨 Emergency Location',
                    text: `I need help! My current location: ${googleMapsUrl}`,
                    url: googleMapsUrl
                });
            } else {
                navigator.clipboard.writeText(googleMapsUrl);
                alert("Location copied to clipboard!");
            }
        }
    };

    return (
        <section className="page sos-page">
            <div className="sos-header">
                <h1>🚨 Emergency SOS</h1>
                <p className="subtitle">Quick action in critical moments. Your safety is our priority.</p>
            </div>

            {/* Main SOS Control - Two Column Layout */}
            <div className="sos-main-layout">
                {/* Left Side - Emergency Hotlines */}
                <div className="emergency-hotlines">
                    <h2>📞 Emergency Hotlines</h2>
                    <div className="hotline-list">
                        <button className="hotline-btn police" onClick={handleCallPolice}>
                            <span className="hotline-icon">👮</span>
                            <div className="hotline-info">
                                <span className="hotline-name">Police</span>
                                <span className="hotline-number">100</span>
                            </div>
                        </button>
                        <button className="hotline-btn ambulance" onClick={handleCallAmbulance}>
                            <span className="hotline-icon">🚑</span>
                            <div className="hotline-info">
                                <span className="hotline-name">Ambulance</span>
                                <span className="hotline-number">108</span>
                            </div>
                        </button>
                        <button className="hotline-btn women" onClick={handleCallWomenHelpline}>
                            <span className="hotline-icon">👩</span>
                            <div className="hotline-info">
                                <span className="hotline-name">Women Helpline</span>
                                <span className="hotline-number">1091</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Side - SOS Control Panel */}
                <div className="sos-control-panel">
                    <div className="sos-main-section">
                        <SOSButton
                            onClick={handleTrigger}
                            label={sos.active ? "⚠️ SOS ACTIVE" : "🆘 TRIGGER SOS"}
                            disabled={sos.active}
                        />

                        {!sos.active && (
                            <div className="sos-quick-actions">
                                <button
                                    className="quick-sos-btn"
                                    onClick={handleQuickTrigger}
                                    disabled={autoSendEnabled}
                                >
                                    ⚡ Quick Alert (5s)
                                </button>
                            </div>
                        )}

                        {sos.active && (
                            <button className="resolve-button" onClick={handleResolve}>
                                ✅ Mark as Safe
                            </button>
                        )}

                        <div className="sos-message-box">
                            <label htmlFor="sosMessage">Optional Message:</label>
                            <textarea
                                id="sosMessage"
                                value={sosMessage}
                                onChange={(e) => setSosMessage(e.target.value)}
                                placeholder="Add details about your emergency (optional)..."
                                rows={3}
                                disabled={sos.active}
                            />
                        </div>

                        <div className="sos-note">
                            <p>{note}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && (
                <div className="countdown-overlay">
                    <div className="countdown-content">
                        <div className="countdown-number">{countdown}</div>
                        <button className="cancel-btn" onClick={cancelCountdown}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Status Cards */}
            <div className="grid">
                <StatusCard title="SOS Status" variant={sos.active ? "danger" : "safe"}>
                    <div className="status-badge-large">
                        {sos.active ? "🚨 ACTIVE" : "✅ RESOLVED"}
                    </div>
                    {sos.time && (
                        <p className="muted">Triggered at: {new Date(sos.time).toLocaleString()}</p>
                    )}
                </StatusCard>

                <StatusCard title="Current Location" variant="info">
                    <p><strong>Latitude:</strong> {location.lat?.toFixed(6) ?? "—"}</p>
                    <p><strong>Longitude:</strong> {location.lng?.toFixed(6) ?? "—"}</p>
                    <button className="share-location-btn" onClick={shareLocation}>
                        📍 Share Location
                    </button>
                </StatusCard>

                <StatusCard title="Emergency Contacts" variant="default">
                    <div className="contact-count">
                        <span className="count-number">{contacts.length}</span>
                        <span className="count-label">contacts will be notified</span>
                    </div>
                    {contacts.length === 0 && (
                        <p className="warning-text">⚠️ No emergency contacts set up. Add contacts to receive alerts.</p>
                    )}
                </StatusCard>
            </div>

            {/* Safety Tips Full Width */}
            <div className="safety-tips-section">
                <h2>💡 Safety Tips During Emergency</h2>
                <div className="tips-grid">
                    <div className="tip-card">
                        <span className="tip-icon">🏃</span>
                        <h3>Stay Calm</h3>
                        <p>Take deep breaths and assess your surroundings</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">📱</span>
                        <h3>Keep Phone Ready</h3>
                        <p>Ensure your phone is charged and accessible</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">👥</span>
                        <h3>Stay in Public</h3>
                        <p>Move towards crowded, well-lit areas</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🔊</span>
                        <h3>Make Noise</h3>
                        <p>Don't hesitate to shout for help if needed</p>
                    </div>
                </div>
            </div>

            {/* What Happens Info */}
            <div className="info-section">
                <h2>ℹ️ What Happens When You Trigger SOS?</h2>
                <ol className="info-list">
                    <li>Your current GPS location is recorded and saved</li>
                    <li>All your emergency contacts receive instant notifications</li>
                    <li>Your location is shared with your trusted contacts</li>
                    <li>Emergency services information is displayed</li>
                    <li>Your SOS status remains active until you mark yourself as safe</li>
                </ol>
            </div>
        </section>
    );
};

export default SOS;
