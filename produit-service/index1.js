require('dotenv/config');
const express = require("express");
const server = express();
const { verify } = require("jsonwebtoken");
const mongoose = require('mongoose');
const Produit = require("./Produit");

const Authentication = require('./isAuth');

const PORT = process.env.PORT || 4001; 



server.use(express.json()); 
server.use(express.urlencoded({extended:true}));


mongoose.set('strictQuery', true);
mongoose.connect(
  "mongodb://localhost/produit-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

server.post('/produit/ajouter',Authentication,(req,res,next) => {
  const {nom, description, prix} = req.body;
  const newProduit = new Produit({
    nom,
    description,
    prix
  });
  newProduit.save()
    .then((doc) => {
      res.statusCode = 200;
      res.json({message: "Le produit a été ajouté avec succès", product: doc})
    })
    .catch((err) => {
      next(err);
    });
});

server.get('/produit/ajouter/:id',(req,res,next)=>{
  let id=req.params.id;
  if(!ObjectId.isValid(id))
     return res.status(404).send('No record with ${id}');
  
  Produit.findById(id)
    .exec()
    .then((product)=> {
      if (!product){
        return res.status(404).send();
      } else{
        res.status(200).json(product);
      }
    })
})

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error'});
});

server.listen(PORT, () =>
  console.log('Server listening on port http://localhost:${PORT}'));