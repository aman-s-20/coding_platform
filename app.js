require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const testCaseRouters = require('./routes/testCaseRoutes')

app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/solutions', solutionRoutes);
app.use('/testCase',testCaseRouters);


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
