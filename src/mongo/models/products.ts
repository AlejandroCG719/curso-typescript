import { Document, model, Schema } from 'mongoose';
import { IUser } from './users';

export interface IProduct  extends Document{
    title:string,
    description:string,
    price:number,
    images:string[];
    user: IUser | string ;

}
const productSchema:Schema = new Schema({
    title:  {type: String, require: true },
    description: {type: String, require: true },
    price:   { type: Number, require: true },
    images: { type : [{ type: String, require: true}], default:[] },
    user:{ type:Schema.Types.ObjectId, ref:'User' ,require: true }
    },
    {
        timestamps: true
    }
    );

export default model<IProduct>('product', productSchema);
