import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import type { Request,Response } from 'express';
import cors from 'cors'
import  { connectDB }  from './config/db.js';
// import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js'
import eventRoutes from './routes/eventRoutes.js'

const app=express();
connectDB();
app.use(cors());
app.use(express.json())
<<<<<<< HEAD
=======
app.use("/api/users",userRouter);
app.use("/api/events",eventRoutes);

>>>>>>> origin/vishal
app.get('/',(req:Request,res:Response)=>{
    res.send("Hello")
});
app.use("/api/users",userRouter)

app.listen(3000,()=>{
    console.log(`Server running in 3000`);
    
})
