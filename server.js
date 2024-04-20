const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { idText } = require('typescript');

const app = express();
const port = 3000;
const mongoURI = 'mongodb://localhost:27017/myapp';
const JWT_SECRET = 'secret';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: String }]
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const newUser = new User({ email, password });
      const user = await newUser.save();
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, password });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/add-favorite', async (req, res) => {
  const { email, movieId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.favorites.includes(movieId.toString())) {
      return res.status(400).json({ error: 'Movie already exists in favorites' });
    }
    user.favorites.push(movieId.toString());
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/remove-favorite', async (req, res) => {
  const { email, movieId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const index = user.favorites.indexOf(movieId.toString());
    if (index === -1) {
      return res.status(400).json({ error: 'Movie not found in favorites' });
    }
    user.favorites.splice(index, 1);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/favorites', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(port, () => console.log(`Server running on port ${port}`));
