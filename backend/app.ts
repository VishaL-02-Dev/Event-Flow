import express from 'express';
import type { Request,Response } from 'express';
import  { connectDB }  from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js'
import eventRoutes from './routes/eventRoutes.js'

const app=express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json())
app.use("/api/users",userRouter);
app.use("/api/events",eventRoutes);

app.get('/',(req:Request,res:Response)=>{
    res.send("Hello")
});


app.listen(3000,()=>{
    console.log(`Server running in 3000`);
    
})
