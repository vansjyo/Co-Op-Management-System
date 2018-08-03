var mongoose = require('mongoose');

var ordersSchema = mongoose.Schema({
	    order_id:{type:String ,required:true,unique:true},
		email: String,
        firstname: String,
        lastname: String,
		telephone: String,
		status: String,
		address: String,
		amount: Number,
		orderList:[{ no:String , item: String, quantity:Number ,price:Number, status: String }]
});

module.exports = mongoose.model('Orders', ordersSchema);