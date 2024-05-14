const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateur = require('./User'); // Ensure this path is correct
require('dotenv').config(); // Load environment variables from .env file

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/register', async (req, res) => {
  const { email, password, nom } = req.body;

  try {
    let userExists = await Utilisateur.findOne({ email: email });
    if (userExists) {
      throw new Error('Utilisateur already exists');
    }
    let hashPassword = await bcrypt.hash(password, 10);
    
    userExists = new Utilisateur({
      email: email,
      password: hashPassword,
      nom: nom // Added missing nom field
    });
    await userExists.save();
    res.send({ message: 'Utilisateur created' });
    console.log(hashPassword);
  } catch (err) {
    res.status(400).send({ error: `${err.message}` });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email: email });
    if (!utilisateur) {
      throw new Error('Email or Password is incorrect');
    }
    const validPassword = await bcrypt.compare(password, utilisateur.password); // Corrected user to utilisateur
    if (!validPassword) {
      throw new Error('Invalid Password');
    }
    const token = jwt.sign({ userId: utilisateur_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: `${err.message}` });
  }
});


const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log('Server is running on port http://localhost:${PORT}');
});