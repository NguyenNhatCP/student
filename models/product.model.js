var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	name: String,
 	image: String,
 	description: String,
 	type_car : String,
    number_car : String,
    number_seat : String,
    gear :  String,
    type_fuel : String,
    price : String,
    sell : String
});

var Product = mongoose.model('Product',productSchema,'products');

module.exports = Product;