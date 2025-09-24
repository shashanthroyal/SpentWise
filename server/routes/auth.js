import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const router = express.Router();

router.post('/register' , async (req , res)=>{
    try {
        const {name , email , password} = req.body;
        const userexists = await User.findOne({email});
        if (userexists) return res.status(400).json({message : "User Already Exists"});

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({name , email , password: hashedPassword});
        res.status(201).json({message: "User Created Successfully" , user
        });

    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

router.post('/login' , async (req , res ) => {
    try {
        const { email , password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "User not exists"});

        const isMatch = await bcrypt.compare(password , user.password);
        if (!isMatch) return res.status(400).json({message : "Incorrect Password"});

        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , { expiresIn: "2d"});

        res.json({
            token , 
            user: {id : user._id , name : user.name , email : user.email}
        });
    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

export default router;


//http://localhost:5000/api/auth/register
//http://localhost:5000/api/auth/login