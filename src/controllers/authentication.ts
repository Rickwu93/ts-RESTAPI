import express from 'express';

import { createUser, getUserByEmail } from 'db/users';
import { random, authentication } from 'helpers';

//creating login route
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }
        //authenticating users without knowing their password
        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }
        //if user authentication passes
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('RICKY-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
//creating register route
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body; //access object from client side through server

        if(!email || !password || !username) {
            return res.sendStatus(400);
        }      
        //check if existing user email exists
        const existingUser = await getUserByEmail(email)
        
        if (existingUser) {
            return res.sendStatus(400);
        }
        //if everything passes and we have email and username and no existing user 
        //we want to create authentication for user
        const salt = random();
        const user = await createUser({
            email, 
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        //return a success message if everything checks out
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}