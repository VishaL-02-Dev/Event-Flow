import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create event (only logged-in users)
router.post("/", protect, createEvent);

// Get all events of logged-in user
router.get("/", protect, getEvents);

// Get single event
router.get("/:id", protect, getEventById);

export default router;