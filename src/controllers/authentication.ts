import express from 'express';

import { createUser, getUserByEmail } from 'db/users';
import { random, authentication } from 'helpers';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body; //access object from client side through server

        if(!email || !password || !username) {
            return res.sendStatus(400);
        }      
        //check if existing user email exists
        const existingUser = await getUserByEmail(email)
        
        if (existingUser) {
            return res.sendStatus(400)
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