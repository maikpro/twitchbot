import { Request, Response } from 'express';
import { AuthService } from '../services/token-service';
import { TwitchService } from '../services/twitch-service';

export const auth = async (req: Request, res: Response) => {
    // Started Login Process
    if (req.query.code && !AuthService.getToken()) {
        AuthService.setToken(await AuthService.createToken(req.query.code.toString()));
        TwitchService.connect();
        res.redirect('/');
        console.log(`New Twitch Token has been generated: ${AuthService.getToken()?.access_token}`);
    }
    // logged in
    else if (AuthService.getToken()) {
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
    if (AuthService.getToken()) {
        res.status(200).contentType('json').send(AuthService.getToken());
    } else {
        res.status(404).send(`No Token found try to <a href=${AuthService.createAuthorizeUrl()}>Login</a>`);
    }
};

export const validate = async (req: Request, res: Response) => {
    const twitchToken = AuthService.getToken();
    if (twitchToken) {
        const result = await AuthService.validate(twitchToken.access_token);
        res.status(200).send(result);
    } else {
        res.status(404).send(`No Token found try to <a href=${AuthService.createAuthorizeUrl()}>Login</a>`);
    }
};
