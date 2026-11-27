
const express = require("express");
const { randomUUID } = require("crypto");

const router = express.Router();

// Temporary in-memory storage
let tickets = [];

// Allowed values
const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const statuses = [
    "OPEN",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
    "CANCELLED"
];

// CREATE TICKET
router.post("/", (req, res) => {
    const {
        requesterId,
        requesterName,
        title,
        description,
        category
    } = req.body;

    // Validate required fields
    if (!requesterId || !requesterName || !title || !description || !category) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    const ticket = {
        ticketId: randomUUID(),
        requesterId,
        requesterName,
        title,
        description,
        category,
        priority: "MEDIUM",
        status: "OPEN",
        assignedTo: null,
        resolutionNote: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolvedAt: null,
        closedAt: null
    };

    tickets.push(ticket);

    res.status(201).json({
        message: "Ticket created successfully",
        ticket
    });
});

// READ ALL TICKETS
router.get("/", (req, res) => {
    res.status(200).json({
        count: tickets.length,
        tickets
    });
});

// READ A SINGLE TICKET
router.get("/:ticketId", (req, res) => {
    const ticket = tickets.find(
        t => t.ticketId === req.params.ticketId
    );

    if (!ticket) {
        return res.status(404).json({
            message: "Ticket not found"
        });
    }

    res.status(200).json(ticket);
});

// UPDATE TICKET
router.put("/:ticketId", (req, res) => {
    const ticket = tickets.find(
        t => t.ticketId === req.params.ticketId
    );

    if (!ticket) {
        return res.status(404).json({
            message: "Ticket not found"
        });
    }

    const {
        title,
        description,
        category,
        priority,
        status,
        assignedTo,
        resolutionNote
    } = req.body;

    // Validate priority if provided
    if (priority && !priorities.includes(priority)) {
        return res.status(400).json({
            message: "Invalid priority value",
            allowedValues: priorities
        });
    }

    // Validate status if provided
    if (status && !statuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid status value",
            allowedValues: statuses
        });
    }

    // Update only provided fields
    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (category !== undefined) ticket.category = category;
    if (priority !== undefined) ticket.priority = priority;
    if (status !== undefined) ticket.status = status;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    if (resolutionNote !== undefined) ticket.resolutionNote = resolutionNote;

    ticket.updatedAt = new Date().toISOString();

    // Record resolution time
    if (status === "RESOLVED" && !ticket.resolvedAt) {
        ticket.resolvedAt = new Date().toISOString();
    }

    // Record closure time
    if (status === "CLOSED" && !ticket.closedAt) {
        ticket.closedAt = new Date().toISOString();
    }

    res.status(200).json({
        message: "Ticket updated successfully",
        ticket
    });
});

// DELETE / CANCEL TICKET (SOFT DELETE)
router.delete("/:ticketId", (req, res) => {
    const ticket = tickets.find(
        t => t.ticketId === req.params.ticketId
    );

    if (!ticket) {
        return res.status(404).json({
            message: "Ticket not found"
        });
    }

    if (ticket.status === "CLOSED" || ticket.status === "RESOLVED") {
        return res.status(400).json({
            message: "Resolved or closed tickets cannot be cancelled"
        });
    }

    ticket.status = "CANCELLED";
    ticket.updatedAt = new Date().toISOString();

    res.status(200).json({
        message: "Ticket cancelled successfully",
        ticket
    });
});

module.exports = router;
