import { useState } from "react";
import StatusCard from "../components/StatusCard.jsx";

const Settings = () => {
    const [alertsEnabled, setAlertsEnabled] = useState(true);

    return (
        <section className="page">
            <h1>Settings</h1>
            <p className="subtitle">Personal control.</p>

            <div className="grid">
                <StatusCard title="Alerts" variant="info">
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={alertsEnabled}
                            onChange={(event) => setAlertsEnabled(event.target.checked)}
                        />
                        <span>Enable emergency alerts</span>
                    </label>
                </StatusCard>

                <StatusCard title="App Info" variant="default">
                    <p>Version: 1.0.0</p>
                    <p className="muted">Built for fast emergency actions.</p>
                </StatusCard>
            </div>
        </section>
    );
};

export default Settings;
