const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Request failed");
    }

    return response.json();
};

export const getHealth = () => request("/health");

export const getSOS = () => request("/sos");
export const triggerSOS = (payload) =>
    request("/sos", {
        method: "POST",
        body: JSON.stringify(payload)
    });
export const resolveSOS = () =>
    request("/sos/resolve", {
        method: "POST"
    });

export const getLocation = () => request("/location");
export const updateLocation = (payload) =>
    request("/location", {
        method: "POST",
        body: JSON.stringify(payload)
    });

export const getContacts = () => request("/contacts");
export const createContact = (payload) =>
    request("/contacts", {
        method: "POST",
        body: JSON.stringify(payload)
    });
export const updateContact = (id, payload) =>
    request(`/contacts/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
export const deleteContact = (id) =>
    request(`/contacts/${id}`, {
        method: "DELETE"
    });

export const getZones = () => request("/zones");
export const getNearbyZones = (lat, lng, radius = 3000) =>
    request(`/zones/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
