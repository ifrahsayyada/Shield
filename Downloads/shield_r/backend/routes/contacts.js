const express = require("express");
const router = express.Router();

const getSorted = (contacts) =>
    [...contacts].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

router.get("/", (req, res) => {
    res.json(getSorted(req.app.locals.store.contacts));
});

router.post("/", (req, res) => {
    const { name, phone, priority } = req.body || {};

    if (!name || !phone) {
        return res.status(400).json({ message: "Name and phone are required" });
    }

    const contact = {
        id: Date.now().toString(),
        name,
        phone,
        priority: Number.isFinite(priority) ? priority : null
    };

    req.app.locals.store.contacts.push(contact);
    res.status(201).json(contact);
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, phone, priority } = req.body || {};
    const contacts = req.app.locals.store.contacts;
    const index = contacts.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Contact not found" });
    }

    const updated = {
        ...contacts[index],
        name: name ?? contacts[index].name,
        phone: phone ?? contacts[index].phone,
        priority: Number.isFinite(priority) ? priority : contacts[index].priority
    };

    contacts[index] = updated;
    res.json(updated);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const contacts = req.app.locals.store.contacts;
    const index = contacts.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Contact not found" });
    }

    const removed = contacts.splice(index, 1)[0];
    res.json(removed);
});

module.exports = router;
