

const express = require('express');
const mongoose = require('mongoose');
const Produit = require('./Produit')
const app = express();


// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1/produit-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    ()=> { 
        console.log('Produit-service DB connected');
    }
);

// Utilisation des routes
app.use(express.json());

// Démarrage du serveur Express
app.listen(4000, () => {
  console.log(`Produit-service est démarré sur le port`);
});