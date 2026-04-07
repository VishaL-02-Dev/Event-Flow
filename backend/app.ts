import express from 'express';
import type { Request,Response } from 'express';
import  { connectDB }  from './config/db.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js'

const app=express();
dotenv.config();
connectDB();

app.get('/',(req:Request,res:Response)=>{
    res.send("Hello")
});
app.use("api/users",userRouter)

app.listen(3000,()=>{
    console.log(`Server running in 3000`);
    
})
