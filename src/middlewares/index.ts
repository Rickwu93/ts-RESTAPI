import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';
//to confirm only owner can delete cookies
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string; //string cause we merged it below

        if (!currentUserId) {
            return res.sendStatus(403)
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }

        next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

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