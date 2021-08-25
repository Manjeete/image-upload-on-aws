const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        max:32,
        
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        lowercase:true
    },
    
},{timestamp:true})


module.exports = mongoose.model('Profile',userSchema); 