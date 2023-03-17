import express from 'express';

import { getAllUsers } from '../controllers/users';
import { isAuthenticated } from '../middlewares';

//adding additional prevention on username showing as cookies
export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
};