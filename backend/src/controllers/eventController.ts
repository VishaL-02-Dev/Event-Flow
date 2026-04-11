import type {Request, Response} from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Event from '../models/Event.js';
import crypto from "crypto";

export const createEvent = async (req: AuthRequest, res:Response) =>{
    try {
        const {name, description, location, date} = req.body;
      console.log(req.user);
      
        const inviteToken = crypto.randomBytes(16).toString("hex");
        console.log(inviteToken);
        

        const event = await Event.create({
            name,
            description,
            location,
            date,
            organizer:req.user?._id,
            inviteToken,
        });
        res.status(201).json(event);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
}

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ organizer: req.user?.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};