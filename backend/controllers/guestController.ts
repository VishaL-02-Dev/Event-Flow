import type { Request, Response } from "express";
import Guest from "../models/Guest.js";
import crypto from "crypto";


export const createGuest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, groupSize, eventId } = req.body;

    if (!name || !groupSize || !eventId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Generate unique entry token
    const entryToken = crypto.randomBytes(16).toString("hex");

    const guest = new Guest({
      name,
      email,
      phone,
      groupSize,
      eventId,
      entryToken,
      checkedIn: false,
      registeredAt: new Date()
    });

    await guest.save();

    res.status(201).json({
      message: "Guest registered successfully",
      guest
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getGuestsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const guests = await Guest.find({ eventId });

    res.status(200).json(guests);

  } catch (error) {
    res.status(500).json({ message: "Error fetching guests", error });
  }
};

/**
 * CHECK-IN GUEST (scan token)
 */
export const checkInGuest = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const guest = await Guest.findOne({ entryToken: token });

    if (!guest) {
      return res.status(404).json({ message: "Invalid token" });
    }

    if (guest.checkedIn) {
      return res.status(400).json({ message: "Already checked in" });
    }

    guest.checkedIn = true;
    guest.checkInAt = new Date();

    await guest.save();

    res.status(200).json({
      message: "Check-in successful",
      guest
    });

  } catch (error) {
    res.status(500).json({ message: "Check-in failed", error });
  }
};

export const softDeleteGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findById(id);

    if (!guest || guest.isDeleted) {
      return res.status(404).json({ message: "Guest not found" });
    }

    guest.isDeleted = true;
    await guest.save();

    res.status(200).json({ message: "Guest soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Soft delete failed", error });
  }
};

export const restoreGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findById(id);

    if (!guest || !guest.isDeleted) {
      return res.status(404).json({ message: "Guest not found or not deleted" });
    }

    guest.isDeleted = false;
    await guest.save();

    res.status(200).json({ message: "Guest restored successfully", guest });
  } catch (error) {
    res.status(500).json({ message: "Restore failed", error });
  }
};