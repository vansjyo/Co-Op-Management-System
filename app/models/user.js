var mongoose = require('mongoose');
var bcrypt= require('bcrypt');

var userSchema = mongoose.Schema({
	local: {
		email: {type:String,required:true,unique:true},
		password: {type:String, required:true},
        firstname: String,
        lastname: String,
		telephone: { type : String, required:true},
		address: String,
		emailConfirmToken:String,
		emailConfirmExpires:Date,
		resetPasswordToken:String,
		resetPasswordExpires: Date,
		mobileOTP:String,
		mobileOTPExpires: Date,
		admin: String,
		cart_enable : Number,
		order_id: String,
		todo:[{ no:String , item : String , quantity:Number , price: Number , status: String , amount: Number }],
		orderList: Array
	}
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.local.password);
}
module.exports = mongoose.model('User', userSchema);

/*, validate: {
          validator: function(v) {
            return /\d{12}/.test(v);
          },
          message: '{VALUE} is not a valid phone number!'
        }*/