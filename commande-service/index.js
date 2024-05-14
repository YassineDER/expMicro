require('dotenv/config');
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Commande = require("./commande");
const axios = require("axios");
const Authentication=require('./isAuth');

const PORT = process.env.PORT ;

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));



mongoose.set('strictQuery', true);
mongoose.connect(
  "mongodb://localhost/commande-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal app Error' });
});


async function prixTotal(produits) {
  let total = 0;
  for (let produit of produits) { // Use for...of loop for clarity
    total += produit.prix;
  }
  console.log("Prix total: " + total);
  return total;
}


async function httpRequest(ids) {
  try {
  const URL = "http://localhost:4000/produit/ajouter"
  const response = await axios.get(URL, {
    params:{ ids: ids }, 
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    }
});
    return prixTotal(response.data);
} catch (error) {
console.error(error);
}
}


app.post("/commande/ajouter",Authentication,async (req, res, next) => {
  const { ids, email_utilisateur } = req.body;

  try {
    const total = await httpRequest(req.body.ids);

    const newCommande = new Commande({
      ids,
      email_utilisateur: email_utilisateur,
      prix_total: total,
    });

    const commande = await newCommande.save();
    // Include prix_total in the response body
    res.status(201).json({ ...commande.toObject(), prix_total: total });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
});


app.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);
