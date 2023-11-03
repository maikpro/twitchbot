import express, { Express } from 'express';
import { auth, getToken, validate } from '../controllers/auth.controller';

const router: Express = express();
router.get('/', auth);
router.get('/token', getToken);
router.get('/token/validate', validate);
export default router;
