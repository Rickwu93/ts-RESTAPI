import express from 'express';

import { getAllUsers, deleteUser, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

//adding additional prevention on username showing as cookies
//order matters
export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
};