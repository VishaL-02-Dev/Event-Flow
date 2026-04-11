import express from 'express';
import {
  createGuest,
  getGuestsByEvent,
  checkInGuest,
  softDeleteGuest,
  restoreGuest,
  getEventByInviteToken
} from '../controllers/guestController.js';

const router = express.Router();
router.get('/invite/:inviteToken', getEventByInviteToken);
router.post('/create', createGuest);
router.get('/event/:eventId', getGuestsByEvent);
router.post('/checkin', checkInGuest);
router.patch('/soft-delete/:id', softDeleteGuest);
router.patch('/restore/:id', restoreGuest);


export default router;