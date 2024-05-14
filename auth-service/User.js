const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom: String,
    email: String,
    mdp: String,
    created_at:{
        type: Date,
        default: Date.now()
    }

});

module.exports = Utilisateur = mongoose.model('User',UserSchema);

