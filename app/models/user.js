var mongoose = require('mongoose');
var bcrypt= require('bcrypt');

var userSchema = mongoose.Schema({
	local: {
		email: {type:String,required:true,unique:true},
		password: {type:String, required:true},
        firstname: String,
        lastname: String,
		telephone: String,
		emailConfirmToken:String,
		emailConfirmExpires:Date,
		resetPasswordToken:String,
		resetPasswordExpires: Date,
		orderOTP:String,
		orderOTPExpires: Date,
		admin: Boolean,
		orderList:[{item_no:String , item_name: String, item_quantity:Number ,item_price: Number}]
	},
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.local.password);
}
module.exports = mongoose.model('User', userSchema);