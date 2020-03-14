import {Request, Response} from 'express'
import Products from '../../mongo/models/products';

const createProduct =  async (req:Request, res:Response): Promise<void> =>{
    const { title,desc,price, images, userId} = req.body;
    try {
        const product = await Products.create({
            title,
            desc,
            price,
            images,
            user:userId
        });
        res.send({ status: 'Ok', data: product });
    } catch (e) {
        console.log(' create product error: ', e);
        res.status(500).send({status:'Error', data: e.message});

    }
};

//const deleteProduct = (req, res) =>{};

//const updateUser = (req, res) =>{};

const getProducts =  async (req:Request, res:Response): Promise<void> =>{
    try {
        const products = await Products.find({
            price:{$gt: 19}
        }).select('tittle price desc').populate('user', 'username _id role email data');
        res.send({status:'OK', data: products});
    }
    catch (e)
    {
        console.log(' getProduct error: ', e);
        res.status(500).send({status:'Error', data: e.message});
    }
};
const getProductsByUser =  async (req:Request, res:Response): Promise<void> =>{
    try {
        const products = await Products.find({
           user:req.params.userId
        });
        console.log(products);
        res.send({status:'OK', data: products});
        }
    catch (e)
    {
        console.log(' getProduct error: ', e);
        res.status(500).send({status:'Error', data: e.message});
    }
};
export default{
    createProduct,
    getProducts,
    getProductsByUser
};