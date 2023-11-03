import express, { Express } from 'express';
import auth from './auth';
import chat from './chat';

const router: Express = express();
router.use('/', auth);

router.use('/auth', auth);

router.use('/chat', chat);

export default router;
