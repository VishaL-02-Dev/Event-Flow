import express from 'express';
import type { Request,Response } from 'express';
import  connectDB  from './config/db.js';


const app=express();

connectDB();

app.get('/',(req:Request,res:Response)=>{
    res.send("Hello")
});

app.listen(3000,()=>{
    console.log(`Server running in 3000`);
    
})
