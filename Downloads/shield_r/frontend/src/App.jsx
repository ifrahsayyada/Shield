import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SOS from "./pages/SOS.jsx";
import Location from "./pages/Location.jsx";
import Contacts from "./pages/Contacts.jsx";
import Zones from "./pages/Zones.jsx";
import Settings from "./pages/Settings.jsx";

const App = () => {
    return (
        <div className="app">
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/sos" element={<SOS />} />
                    <Route path="/location" element={<Location />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/zones" element={<Zones />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
