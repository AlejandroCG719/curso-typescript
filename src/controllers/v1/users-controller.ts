
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response} from "express";
import Users from '../../mongo/models/users';
import Products from '../../mongo/models/products';

const expiresIn = 60 * 10;
const login = async (req:Request, res:Response):Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (user){
            const isOk = await bcrypt.compare(password,user.password);
            if (isOk){
                const token = jwt.sign(
             { userId: user._id, role: user.role },
                     process.env.JWT_SECRET!,
             { expiresIn: expiresIn },
                );
                res.send({
                    status: 'Ok',
                    data: {
                        token,
                        expiresIn
                    }
                })
            }else{
                res.status(403).send({ status: 'Invalid Password', message: ''})
            }
        }else {
            res.status(401).send({ status: 'User_Not_Found', message: ''})
        }
    } catch (error) {
        res.status(500).send({ status: 'Error', message: error.message});
    }

};
const createUser = async (req:Request, res:Response):Promise<void> => {
    try
    {
        //console.log("req.body", req.body);
        const {username, email, password, data} = req.body;

        const hash = await bcrypt.hash(password, 15);

       /* await Users.create({
            username,
            email,
            data,
            password: hash
        });*/
       const user = new Users();
       user.username = username;
       user.email = email;
       user.password= hash;
       user.data = data;

       await user.save();

        res.send({ status:'Ok', message:'user-create'});
    } catch (error)
    {
        if (error.code  && error.code === 11000){
            res.status(400).send({ status:'DUPLICATE_VALUES', message: error.keyValue });
            return ;
        }
        //console.log('Error createuser ',error);
    }
};
const deleteUser = async (req:Request, res:Response):Promise<void> =>{
    try {
        const { userId } = req.body;
        if (!userId){
            throw  new Error('missing para userid')
        }else{

        }
        await Users.findByIdAndDelete(userId);
        await Products.deleteMany({
            user : userId
        });
        res.send({ status: 'Ok', message: 'user delete' });
    }catch (e) {
        res.status(500).send({ status: 'Error', message: e.message });
    }
    res.send({ status: 'Ok', message: 'deleteUser' });
};
const updateUser =  async (req:Request, res:Response):Promise<void> =>{
    try {
        console.log('req sessionda' , req.sessionData.userId);
        const { username, email, data } = req.body;
        await Users.findByIdAndUpdate(req.sessionData.userId,{
            username,
            email,
            data
        });
        res.send({ status: 'Ok', message: 'user update' });
    } catch (error) {
        if (error.code  && error.code === 11000){
            res.status(400).send({ status:'DUPLICATE_VALUES', message: error.keyValue });
            return ;
        }
        res.status(500).send({ status: 'Error', message: 'user update' });
    }
};
const getUsers = async (req:Request, res:Response):Promise<void> =>{
    try{
        const users = await Users.find().select({ password: 0, __v:0, role :0 });
        res.send({ status: 'Ok', data: users });
    }catch (e) {
        res.status(500).send({ status: 'Error', message: 'user update' });
    }

};
export default {
    login,
    createUser,
    updateUser,
    getUsers,
    deleteUser

};