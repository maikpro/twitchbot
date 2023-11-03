import express, { Express } from 'express';
import { chat } from '../controllers/chat.controller';

const router: Express = express();
router.get('/', chat);
export default router;
