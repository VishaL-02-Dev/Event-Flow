import express from 'express';
import {
  createGuest,
  getGuestsByEvent,
  checkInGuest,
  softDeleteGuest,
  restoreGuest
} from '../controllers/guestController.js';

const router = express.Router();

router.post('/create', createGuest);

router.get('/event/:eventId', getGuestsByEvent);

router.post('/checkin', checkInGuest);

router.patch('/soft-delete/:id', softDeleteGuest);


router.patch('/restore/:id', restoreGuest);


export default router;