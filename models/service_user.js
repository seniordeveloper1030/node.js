const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../Config/database');

//User 
const ServiceUserSchema = mongoose.Schema({
	username:{
		type: String
	},
	firstname:{
		type: String
	},
	lastname:{
		type: String
	},
	dateofbirth:{
		type: Date
	},
	phone:{
		type: String
	},
	address:{
		type: String
	},
	country:{
		type: String
	},
	usertype:{
		type: String
	},
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	
	resetPasswordToken:{
		type: String,
	},
	resetPasswordExpires:{
		type: Date
	}
});

const ServiceUser = module.exports = mongoose.model('ServiceUser', ServiceUserSchema);

module.exports.getUserById = function(id, callback){
	ServiceUser.findById(id,callback);
}

module.exports.getUserByUsername = function(username, callback){
	const query = {username: username};
	ServiceUser.findOne(query,callback);
}
module.exports.getUserByEmail = function(email, callback){
	const query = {email: email};
	ServiceUser.findOne(query,callback);
}

module.exports.addUser = function(newUser, callback){

	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(newUser.password,salt,(err,hash)=>{
			if(err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
		if(err) throw err;
		callback(null,isMatch);
	});
}
module.exports.updateUser = function(updateObj, callback){
	ServiceUser.update({_id:updateObj.id},{$set:{
							firstname:updateObj.user.firstname,
		lastname:updateObj.user.lastname,dateofbirth:updateObj.user.dateofbirth,phone:updateObj.user.phone,
		email:updateObj.user.email,address:updateObj.user.address,country:updateObj.user.country}},callback);
}
module.exports.getUserByEmailOrUsername = function(data,callback){
	const query = { $or : [{username:data},{email:data}]};
	ServiceUser.findOne(query,callback);
}
module.exports.getUserByToken = function(data, callback){
	const query = {resetPasswordToken:data, resetPasswordExpires:{ $gt: Date.now() }};
	ServiceUser.findOne(query, callback);
}