import express from "express";
import {
  adminLogin,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllEventsAdmin,
  blockEvents,
  unblockEvents,
  getAllGuestsAdmin,
  blockGuest,
  unblockGuest,
  getAdminDashboard
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
// import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);

// router.use(protect, isAdmin);

router.get("/dashboard", protect,getAdminDashboard);

router.get("/users",protect, getAllUsers);
router.patch("/users/:userId/block", blockUser);
router.patch("/users/:userId/unblock", unblockUser);

router.get("/events", getAllEventsAdmin);
router.patch("/events/:eventId/block", blockEvents);
router.patch("/events/:eventId/unblock", unblockEvents);

router.get("/guests", getAllGuestsAdmin);
router.patch("/guests/:guestId/block", blockGuest);
router.patch("/guests/:guestId/unblock", unblockGuest);

export default router;