import User from "../models/User.js";
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import Event from "../models/Event.js";
import { getPagination } from "../utils/pagination.js";
import Guest from "../models/Guest.js";


export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const user = await User.findOne({ email })
        console.log(user);;
        if (!user || !user.isAdmin) {
            return res.status(400).json({ message: "Invalid Admin Login credentials" })
        }
        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET as string, { expiresIn: "1d" })

        res.status(200).json({
            message: "Admin Login Successfully", token, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error })
    }
}
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const user = await User.find()
        if (!user) {
            return res.status(400).json({ message: "User is not found" })
        }

        return res.status(200).json({ message: "User is fetched", user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error })

    }
}

export const blockUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true }
        )
        if (!user) {
            return res.status(400).json({ message: "User Not found" })
        }

        return res.status(200).json({ message: "User Soft Deleted" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const unblockUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { isDeleted: false },
            { new: true }
        )
        return res.status(200).json({ message: "User Restored", user })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", error })

    }
}

export const getAllEventsAdmin = async (req: Request, res: Response) => {
    try {
        const { page, limit, skip } = getPagination(req);
        const search = (req.query.search as string)
        const date = req.query.date as string;
        const query: any = {
            isDeleted: false,
            name: { $regex: search, $options: "i" }
        }
        if (date) {
            query.date = new Date(date)
        }
        const total = await Event.countDocuments(query);
        const events = await Event.find().skip(skip).limit(limit).sort({ createdAt: -1 });

        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalEvents: total,
            events
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })

    }
}

export const blockEvents = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndUpdate(eventId, { isDeleted: true }, { new: true });
        if (!event) {
            return res.status(400).json({ message: "Events are not found" })
        }

        return res.status(200).json(event)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

export const unblockEvents = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndUpdate(eventId, { isDeleted: false }, { new: true })
        res.status(200).json(event)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" })
    }


}

export const getAllGuestsAdmin = async (req: Request, res: Response) => {
    try {
        const { page, limit, skip } = getPagination(req);
        const eventId = req.query.eventId as string;

        const query: any = {};

        if (eventId) {
            query.event = eventId;
        }

        const total = await Guest.countDocuments(query);

        const guests = await Guest.find(query)

            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalGuests: total,
            guests
        });

    } catch {
        res.status(500).json({ message: "Server Error" });
    }
};

export const blockGuest = async (req: Request, res: Response) => {
    try {
        const { guestId } = req.params;

        const guest = await Guest.findByIdAndUpdate(
            guestId,
            { isDeleted: true },
            { new: true }
        );

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        res.status(200).json({ message: "Guest blocked successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
export const unblockGuest = async (req: Request, res: Response) => {
    try {
        const { guestId } = req.params;

        const guest = await Guest.findByIdAndUpdate(
            guestId,
            { isDeleted: false },
            { new: true }
        );

        if (!guest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        res.status(200).json({ message: "Guest unblocked successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAdminDashboard = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalEvents = await Event.countDocuments({ isDeleted: false });
        const activeUsers = await User.countDocuments({ isDeleted: false });
        const deletedUsers = await User.countDocuments({ isDeleted: true });
        const activeEvents = await Event.countDocuments({ isDeleted: false })
        const deletedEvents = await Event.countDocuments({ isDeleted: true })
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const newUsers = await User.countDocuments({
            createdAt: { $gte: last7Days }
        });
        const newEvents = await Event.countDocuments({
            createdAt: {
                $gte: last7Days
            }
        })
        res.json({
            totalUsers,
            totalEvents,
            users: { activeUsers, deletedUsers },
            events: { activeEvents, deletedEvents },
            growth: { newUsers, newEvents }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" })

    }
}