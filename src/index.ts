import express, { Express } from 'express';
import routes from './routes/index';

const router: Express = express();
const serverUrl: URL = new URL(process.env.SERVER_URL!);

router.use('/', routes);

router.listen(serverUrl.port, () => {
    console.log(`Twitch Bot router runs at ${serverUrl.href}`);
});
