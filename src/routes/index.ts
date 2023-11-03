import express, { Express } from 'express';
import auth from './auth';

const router: Express = express();
router.use('/', auth);
router.use('/auth', auth);

export default router;
