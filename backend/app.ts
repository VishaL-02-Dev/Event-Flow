import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import type { Request,Response } from 'express';
import  { connectDB }  from './config/db.js';
import userRouter from './routes/userRoutes.js'

const app=express();
connectDB();
app.use(express.json());
app.get('/',(req:Request,res:Response)=>{
    res.send("Hello")
});
app.use("/api/users",userRouter)

app.listen(3000,()=>{
    console.log(`Server running in 3000`);
    
})
