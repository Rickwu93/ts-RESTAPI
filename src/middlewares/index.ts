import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

// authenticating middleware, async takes in req/res
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['RICKY-AUTH'] //using same cookie from  controller authentication
//if no session
        if(!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser) {
            return res.sendStatus(403);
        }

        //using merge on our request object
        merge(req, { identity: existingUser });

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}