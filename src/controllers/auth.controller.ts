import { Request, Response } from 'express';
import { AuthService } from '../services/token-service';
import { TwitchToken } from '../models/TwitchToken';

let token: TwitchToken | null = null;

export const auth = async (req: Request, res: Response) => {
    // Started Login Process
    if (req.query.code && !token) {
        token = await AuthService.getToken(req.query.code.toString());
        res.redirect('/');
        console.log(`New Twitch Token has been generated: ${token}`);
    }
    // logged in
    else if (token) {
        res.status(200).send(
            "You're logged in: <a href='/auth/token'>See the token</a>" +
                '<br>' +
                "Validate the token here: <a href='/auth/token/validate'>Validate!</a>",
        );
    }
    // start
    else {
        res.status(200).send(`Welcome <a href=${AuthService.createAuthorizeUrl()}>Login</a>`);
    }
};

export const getToken = (req: Request, res: Response) => {
    if (token) {
        res.status(200).contentType('json').send(token);
    } else {
        res.status(404).send(`No Token found try to <a href=${AuthService.createAuthorizeUrl()}>Login</a>`);
    }
};

export const validate = async (req: Request, res: Response) => {
    if (token) {
        const result = await AuthService.validate(token.access_token);
        res.status(200).send(result);
    } else {
        res.status(404).send(`No Token found try to <a href=${AuthService.createAuthorizeUrl()}>Login</a>`);
    }
};
