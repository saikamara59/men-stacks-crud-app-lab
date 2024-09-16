const mongoose = require('mongoose') 
const nbaSchema = new mongoose.Schema({

    name: {type: String, required: true}, 
    isAPlayer: {type: String, required:true},
     }) 
    const Nba = mongoose.model('Nba',nbaSchema) 
    
    
    module.exports = Nba;
    