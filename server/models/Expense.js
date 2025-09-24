import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
    userId : { type: mongoose.Schema.ObjectId, ref: "User" , required : true},
    title: {type: String , required: true},
    amount: {type: String , required: true},
    category: {type: String , required: true},
    date: {type: Date , default: Date.now},
    },{
        timestamps: true
    }
);



const Expense = mongoose.model("Expense" , expenseSchema);

export default Expense;