import { Router } from 'express';
import {
  getEventTypes,
  getEventTypeById,
  getEventTypeBySlug,
  createEventType,
  updateEventType,
  deleteEventType,
} from '../controllers/eventTypesController';

const router = Router();

router.get('/',           getEventTypes);
router.get('/slug/:slug', getEventTypeBySlug);   // public — before /:id
router.get('/:id',        getEventTypeById);
router.post('/',          createEventType);
router.put('/:id',        updateEventType);
router.delete('/:id',     deleteEventType);

export default router;
