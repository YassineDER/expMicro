const mongoose = require('mongoose');

// Définir le schéma de la commande
const CommandeSchema = new mongoose.Schema({
    produits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit'
    }],
    email_utilisateur: {
        type: String,
        required: true
    },
    prix_total: {
        type: Number,
        required: true
    },
    date_commande: {
        type: Date,
        default: Date.now
    }
});

// Créer le modèle à partir du schéma
const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;