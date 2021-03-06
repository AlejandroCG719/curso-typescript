import express,{ Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import routesV1 from './routes/v1';

dotenv.config();
declare global {
    namespace Express{
        export interface Request {
            sessionData: any;
        }
    }
}


const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

routesV1(app);

const PORT: number | string = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO! ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then( () => {
        app.listen(4000, () => {
            console.log(`running on ${ PORT }`);
        });
        console.log("Conecte to mongo");
    })
    .catch( (err) =>{
        console.log("Mongo Error ", err);
    });
