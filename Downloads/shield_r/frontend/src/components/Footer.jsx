const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">
                        <span className="footer-icon">🛡️</span>
                        SHIELD_R
                    </h3>
                    <p className="footer-tagline">Your Personal Safety Companion</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="/">Dashboard</a></li>
                        <li><a href="/sos">Emergency SOS</a></li>
                        <li><a href="/zones">Safe Zones</a></li>
                        <li><a href="/contacts">Contacts</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Emergency</h4>
                    <ul className="footer-links">
                        <li>📞 Police: 100</li>
                        <li>🚑 Ambulance: 108</li>
                        <li>🚒 Fire: 101</li>
                        <li>👩 Women Helpline: 1091</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Stay Safe</h4>
                    <p className="footer-text">Always share your location with trusted contacts</p>
                    <p className="footer-text">Keep emergency numbers handy</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 SHIELD_R. Keeping you safe, always. 💖</p>
            </div>
        </footer>
    );
};

export default Footer;
