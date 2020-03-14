import {Application} from 'express';
import  usersroutes from './users-route';
import productsroutes from './products-route';

export = (app:Application) =>{
    app.use('/api/v1/users', usersroutes );
    app.use('/api/v1/products', productsroutes );
};
