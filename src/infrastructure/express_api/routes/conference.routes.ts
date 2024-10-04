import express from 'express';

import { bookSeat, changeDates, changeSeats, createConference } from '../controllers/conference.controllers';
import { isAuthenticated } from '../middlewares/authentication.middleware';
import container from '../config/dependency-injection';

const router = express.Router();

router.use(isAuthenticated);

router.post('/conference', createConference(container));
router.post('/conference/book/:id', bookSeat(container));
router.patch('/conference/seats/:id', changeSeats(container));
router.patch('/conference/dates/:id', changeDates(container));

export default router;