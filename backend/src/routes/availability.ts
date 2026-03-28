import { Router } from 'express';
import {
  getAvailability,
  upsertAvailability,
  getAvailableSlots,
} from '../controllers/availabilityController';

const router = Router();

router.get('/',       getAvailability);
router.put('/',       upsertAvailability);
router.get('/slots',  getAvailableSlots);   // public

export default router;
