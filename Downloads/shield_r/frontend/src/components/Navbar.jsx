import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="brand">
                    <span className="brand-icon">🛡️</span>
                    <span className="brand-text">SHIELD_R</span>
                </div>
                <nav className="nav-links">
                    <NavLink to="/" end className="nav-link">
                        <span className="nav-icon">🏠</span>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/sos" className="nav-link nav-link-sos">
                        <span className="nav-icon">🆘</span>
                        <span>SOS</span>
                    </NavLink>
                    <NavLink to="/location" className="nav-link">
                        <span className="nav-icon">📍</span>
                        <span>Location</span>
                    </NavLink>
                    <NavLink to="/contacts" className="nav-link">
                        <span className="nav-icon">👥</span>
                        <span>Contacts</span>
                    </NavLink>
                    <NavLink to="/zones" className="nav-link">
                        <span className="nav-icon">🗺️</span>
                        <span>Zones</span>
                    </NavLink>
                    <NavLink to="/settings" className="nav-link">
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
