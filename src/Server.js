const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Feedback = require('./models/feedback');

const app = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose
  .connect(
    'mongodb+srv://<username>:<password>@cluster0.xbisgqe.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Atlas connected...'))
  .catch((err) => console.log(err));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Define feedback schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create feedback model
const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

// Handle feedback form submission
app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body;
  const feedback = new FeedbackModel({ name, email, message });
  feedback.save((err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));
