var authController = require('./auth.controller');
var Product = require('../models/product.model');

module.exports.index = async (req, res,next) => {
  try {
      var pageData = {
        title:'Product',
        name: 'products'
    };
    var page = parseInt(req.query.page) || 1; //n=1
    var perPage = 6;
    res.locals.page = page;
    await Product.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('product/index', {
                    pageData: pageData,
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            });
        });
} catch (error) {
    next(error);
  }
}
module.exports.add = async(req,res)=>
{
  var pageData = {
        title:'Create Product',
        name: 'Add Product'
    };
  res.render("product/create",{
    pageData: pageData
  });
}
module.exports.addProduct = async(req,res,next) =>{
  try
  {
    var product = new Product();
    product.name        = req.body.name;
    product.description = req.body.description;
    product.type_car    = req.body.type_car;
    product.number_car  = req.body.number_car;
    product.number_seat   = req.body.number_seat;
    product.gear        = req.body.gear;
    product.type_fuel   = req.body.type_fuel;
    product.price       = req.body.price;
    product.image       = "../"+req.file.path.split('/').slice(1).join('/');
    console.log(''+product.image);

     product.save(function(err) {
        if (err) throw err
        res.redirect('/products/add-product')
    });
  }
  catch(error) {
    next(error);
  }
}
module.exports.search = async(req,res,next) =>{ 
  try {
  var pageData = {
        title:'Search Product',
        name: 'Product Search Results'
    };
  //Lọc các phần tử có từ khóa q
  var q = req.query.q;

  var products = await Product.find({});
  var  matchedProducts = products.filter(function (product){
      return product.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  //6 product 1 page
  var page = parseInt(req.query.page) || 1;
  var perPage = 6;
  var start = (page - 1)* perPage;
  var end = page * perPage;
  //link goc 
  var baseUrl = '?q='+ q+'\&';
  res.locals.page = page;

  Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('product/index', {
                    pageData: pageData,
                    products: matchedProducts.slice(start,end),
                    current: page,
                    KeyWord: q,
                    pages: Math.ceil(matchedProducts.length / perPage),
                    baseUrl: baseUrl
                });
            });
  }
  catch(error)
  {
      next(error);
  }
};
//Admin
module.exports.view = function(req,res){
  var pageData = {
      title:'Manager Products'
  }
  try{
        Product.find({}).then(products => {
          res.render('product/view', { pageData: pageData,products });
        });
    }catch(e){
        console.log(e);
    }
};
module.exports.delete = async (id, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        let product = await Product.findById(id)
        if (!product) {
            throw `Can not find product with Id=${id}`
        }
        if (signedInUser.id !== product.author.toString()) {
            throw "Can not delete record because you are not author"
        }
        Product.deleteOne({ _id: id })
    } catch (error) {
        throw error
    }
};






