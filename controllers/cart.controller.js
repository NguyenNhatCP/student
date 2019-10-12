var db = require('../db');

module.exports.index = function(req,res){
  let sessionId = req.signedCookies.sessionId;
  var countCart =  Object.values(db.get("sessions").find({ id: sessionId }).get("cart").value());
  res.locals.countCart = countCart;
};

module.exports.addToCart = function(req,res,next){
  var productId = req.params.productId;
  let sessionId = req.signedCookies.sessionId;

  if (!sessionId) {
    res.redirect('/products');
    return;
  }
  let count = db
    .get('sessions')
    .find({ id: sessionId })
    .get('cart.' + productId, 0)
    .value()

  db.get('sessions')
    .find({ id: sessionId })
    .set('cart.' +  productId, count+1)
    .write();

  res.redirect('/products')
};