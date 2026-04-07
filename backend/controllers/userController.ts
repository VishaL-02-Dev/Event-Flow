import type { Request,Response } from "express"
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
const jwtSecret=process.env.JWT_SECRET||"your secret key"
export const registerUser=async (req:Request,res:Response) => {
    try {
       const {name,email,password}=req.body; 
       if(!name || !email ||!password)
       {
        return res.status(400).json({message:"All Feilds are manadatory"})
       }

       const emailExists=await User.findOne({email});
       if(emailExists)
       {
        return res.status(409).json({message:"User already exists"})
       }

       const newUser=await User.create({
        name:name,
        email:email,
        password:password
       });

       return res.status(200).json({message:"User Registered Successfully"})
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({message:"Server Error"});

    }
}


export const loginUser=async (req:Request,res:Response) => {
    try {
        const {email,password}=req.body;
        const findUser=await User.findOne({email});
        if(!findUser)
        {
            return res.status(400).json({message:"User doesnt exist"})
        }

        const passCompare=await findUser.comparePassword(password);
        if(!passCompare)
        {
            return res.status(400).json({message:"Password is invalid and not matched"})
        }
const token=jwt.sign({
    id:findUser._id,isAdmin:findUser.isAdmin
},jwtSecret,{expiresIn:"1h"})
        return res.status(200).json({message:"User LoggedIn Successfully",token,user:{
            _id:findUser._id,
            name:findUser.name,
            email:findUser.email,
            isAdmin:findUser.isAdmin
        }})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"server Error"})
        
    }
}