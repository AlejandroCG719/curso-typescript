import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction} from "express";

const isValidaHostname = ( req:Request, res:Response, next:NextFunction):void => {
    const validHost = [ 'diana.ec', 'localhost'];
    if ( validHost.includes(req.hostname)){
        next();
    }else{
        res.status(403).send({status: 'ACCES_DENIED' });
    }
    console.log('req.hostname', req.hostname);
};
const isAuth = (req:Request, res:Response, next:NextFunction):void => {
    try {
        const  {token} = req.headers;
        if ( token ){
            const  data:any = jwt.verify(token as string, process.env.JWT_SECRET!);
            console.log('jwt data' , data);
            req.sessionData = {userId: data.userId , role: data.role };
            next();
        }else {
            throw { code: 403, status:'ACCESS_DENIED', message: 'Missing header token'};
        }
    }catch (e) {
        res
            .status(e.code || 500)
            .send({ status:e.status || 'ERROR' , message: e.message});
    }
};
const isAdmin = (req:Request, res:Response, next:NextFunction):void => {
    try {
        const { role } = req.sessionData;
        console.log("Is admin" , role);
        if (role !== 'admin'){
            throw {
                code: 403,
                status:'ACCESS_DENIED',
                message: 'Invalid Role'
            };
        }else {
            next();
        }
    }catch (e) {
        res
            .status(e.code || 500)
            .send({ status:e.status || 'ERROR' , message: e.message});
    }
};

export { isValidaHostname, isAuth, isAdmin };
