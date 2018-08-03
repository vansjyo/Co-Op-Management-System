var mongoose = require('mongoose');


var saleSchema = mongoose.Schema({
	    sale_owner: String,
	    sale_date: Date,
	    sale_contact: String,
		sale_name: String,
        sale_price: Number,
        sale_quantity: Number,
        sale_dop: Date,
        sale_category: String,
        sale_url: String,
        sale_type : String,
        sale_status : Boolean
});

module.exports = mongoose.model('Sale_Items', saleSchema);

