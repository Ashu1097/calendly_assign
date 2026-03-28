import { Router } from 'express';
import { getMeetings, getMeetingById, cancelMeeting } from '../controllers/meetingsController';

const router = Router();

router.get('/',           getMeetings);
router.get('/:id',        getMeetingById);
router.patch('/:id/cancel', cancelMeeting);

export default router;
