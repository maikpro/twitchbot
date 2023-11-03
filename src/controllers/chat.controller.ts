import { Request, Response } from 'express';

export const chat = (req: Request, res: Response) => {
    res.send(`The Twitch WebSocket URL: <br> <b>${process.env.WEBSOCKET_URL!}</b>`);
};
