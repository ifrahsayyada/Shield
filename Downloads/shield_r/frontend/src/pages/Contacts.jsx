import { useEffect, useState } from "react";
import {
    createContact,
    deleteContact,
    getContacts,
    updateContact
} from "../services/api.js";
import StatusCard from "../components/StatusCard.jsx";

const emptyForm = { name: "", phone: "", priority: "", relationship: "" };

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const loadContacts = async () => {
        const data = await getContacts();
        setContacts(data);
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            await createContact({
                name: form.name.trim(),
                phone: form.phone.trim(),
                priority: form.priority === "" ? null : Number(form.priority),
                relationship: form.relationship.trim()
            });
            setForm(emptyForm);
            setSuccessMessage("✅ Contact added successfully!");
            await loadContacts();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            await deleteContact(id);
            setSuccessMessage("Contact removed");
            await loadContacts();
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleSMS = (phone) => {
        window.location.href = `sms:${phone}`;
    };

    const getRelationshipIcon = (relationship) => {
        const rel = relationship?.toLowerCase() || "";
        if (rel.includes("family") || rel.includes("parent") || rel.includes("sibling")) return "👨‍👩‍👧‍👦";
        if (rel.includes("friend")) return "🤝";
        if (rel.includes("work") || rel.includes("colleague")) return "💼";
        if (rel.includes("neighbor")) return "🏘️";
        if (rel.includes("partner") || rel.includes("spouse")) return "💑";
        return "👤";
    };

    return (
        <section className="page contacts-page">
            <div className="contacts-header">
                <h1>👥 Emergency Contacts</h1>
                <p className="subtitle">Your trusted circle for emergencies</p>
            </div>

            <StatusCard title="➕ Add New Contact" variant="info">
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Contact Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="relationship"
                        placeholder="Relationship (e.g., Family, Friend, Colleague)"
                        value={form.relationship}
                        onChange={handleChange}
                    />
                    <input
                        name="priority"
                        placeholder="Priority (1 = highest)"
                        value={form.priority}
                        onChange={handleChange}
                        type="number"
                        min="1"
                    />
                    <button className="primary-button" type="submit">
                        ➕ Add Contact
                    </button>
                </form>
                {error && <p className="error-text">⚠️ {error}</p>}
                {successMessage && <p className="success-text">{successMessage}</p>}
            </StatusCard>

            {/* Contact Statistics */}
            {contacts.length > 0 && (
                <div className="contact-stats">
                    <div className="stat-item">
                        <span className="stat-icon">👥</span>
                        <div>
                            <p className="stat-value">{contacts.length}</p>
                            <p className="stat-label">Total Contacts</p>
                        </div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <div>
                            <p className="stat-value">{contacts.filter(c => c.priority).length}</p>
                            <p className="stat-label">Priority Contacts</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contacts List */}
            {contacts.length === 0 ? (
                <div className="empty-state">
                    <span style={{ fontSize: "4rem" }}>📭</span>
                    <h2>No contacts yet</h2>
                    <p>Add your first emergency contact above</p>
                </div>
            ) : (
                <>
                    <div className="contacts-list">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="contact-card">
                                <div className="contact-header">
                                    <div className="contact-avatar">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    {contact.priority && (
                                        <div className="priority-badge">
                                            ⭐ {contact.priority}
                                        </div>
                                    )}
                                </div>

                                <div className="contact-info">
                                    <h3 className="contact-name">{contact.name}</h3>
                                    {contact.relationship && (
                                        <p className="contact-relationship">
                                            {getRelationshipIcon(contact.relationship)} {contact.relationship}
                                        </p>
                                    )}
                                    <p className="contact-phone">📞 {contact.phone}</p>
                                </div>

                                <div className="contact-actions">
                                    <button
                                        className="call-button"
                                        onClick={() => handleCall(contact.phone)}
                                        title="Call this contact"
                                    >
                                        📞 Call
                                    </button>
                                    <button
                                        className="sms-button"
                                        onClick={() => handleSMS(contact.phone)}
                                        title="Send SMS"
                                    >
                                        💬 SMS
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(contact.id)}
                                        title="Delete contact"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Tips Section */}
            <div className="contacts-tips-section">
                <h2>💡 Tips for Emergency Contacts</h2>
                <div className="tips-grid">
                    <div className="tip-card">
                        <span className="tip-icon">✅</span>
                        <h3>Choose Wisely</h3>
                        <p>Add people who are usually available and live nearby</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🔢</span>
                        <h3>Keep 3-5 Contacts</h3>
                        <p>Having too many contacts can slow down response time</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">⚡</span>
                        <h3>Set Priorities</h3>
                        <p>Use priority levels to indicate who should be contacted first</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">🔄</span>
                        <h3>Keep Updated</h3>
                        <p>Regularly verify phone numbers and availability</p>
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <div className="contacts-info-section">
                <h2>ℹ️ How Emergency Contacts Work</h2>
                <ul className="info-list">
                    <li>When you trigger an SOS, all your emergency contacts are notified instantly</li>
                    <li>Your current GPS location is shared with your contacts automatically</li>
                    <li>Priority contacts (marked with ⭐) are notified first</li>
                    <li>You can call or message any contact directly from this page</li>
                    <li>Your contact information is stored securely and never shared without your permission</li>
                </ul>
            </div>
        </section>
    );
};

export default Contacts;
