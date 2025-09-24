import express from 'express';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth , async (req , res) => {
    try {
        const expense = await Expense.create({...req.body , userId: req.user.id});
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
});


router.get('/' , auth , async (req , res) => {
    try {
        const expenses = await Expense.find({userId: req.user.id}).sort({date: -1});
        res.json(expenses)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', auth , async (req , res) => {
    try {
        const updated = Expense.findByIdAndUpdate(req.params.id , req.body, { new: true})
        res.json(updated)
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
});

router.delete('/:id', auth , async (req , res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id)
        res.json({message: "Expense Deleted"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
})

export default router;

//http://localhost:5000/api/expenses/
//http://localhost:5000/api/expenses/:id