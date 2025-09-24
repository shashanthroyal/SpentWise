import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';


dotenv.config();

const app = express()
app.use(cors());
app.use(express.json());


app.use("/api/auth"  , authRoutes);
app.use("/api/expenses" , expenseRoutes)



mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Database connected"))
.catch(err => console.log("Connection error" , err))


app.get('/' , (req , res) =>{
    res.send("API is running")
})


const PORT =  5000

app.listen(PORT , () => {
    console.log(`Server is running on ${PORT}`)
})