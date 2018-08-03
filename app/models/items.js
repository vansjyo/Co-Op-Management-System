var mongoose = require('mongoose');


var itemsSchema = mongoose.Schema({
	    item_no: {type:String,required:true,unique:true},
		item_name: {type:String, required:true},
        item_price: Number,
        item_quantity: Number,
        item_sales: Number,
        item_category: String,
        item_collection: String,
        item_url: String,
        item_changes: Array
});

module.exports = mongoose.model('Items', itemsSchema);

