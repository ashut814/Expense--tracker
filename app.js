const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/expenseDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Expense Schema
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
});

const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  Expense.find({}, (err, expenses) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(expenses);
    }
  });
});

app.post('/expense', (req, res) => {
  const { description, amount } = req.body;

  const newExpense = new Expense({
    description,
    amount,
  });

  newExpense.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/');
    }
  });
});

app.delete('/expense/:id', (req, res) => {
  const expenseId = req.params.id;

  Expense.findByIdAndRemove(expenseId, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Expense deleted successfully');
    }
  });
});

// Bonus: Edit expense
app.put('/expense/:id', (req, res) => {
  const expenseId = req.params.id;
  const { description, amount } = req.body;

  Expense.findByIdAndUpdate(
    expenseId,
    { description, amount },
    { new: true },
    (err, updatedExpense) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(updatedExpense);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
