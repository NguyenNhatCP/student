var shortid = require('shortid');
var db = require('../db');


module.exports = function(req,res,next){
  if (!req.signedCookies.sessionId) {
    var sessionId = shortid.generate()

    res.cookie('sessionId', sessionId, {
      signed: true
    });

    db.get('sessions').push({
      id: sessionId
    }).write();
    console.log(req.signedCookies.sessionId);
  }
  let sessionid = req.signedCookies.sessionId;
  let productNumber = db.get("sessions").find({ id: sessionid }).get("cart").size().value();
  res.locals.productNumber = productNumber;

  let productIdArray = Object.keys(db.get("sessions").find({ id: sessionid }).get("cart").value() || []);
  res.locals.productIdArray = productIdArray;
 
 
  let productNameArray = [];
  productIdArray.forEach(element => {
  productNameArray.push(db.get("products").find({ id: element }).get("name").value() || "");
 });
  res.locals.productNameArray = productNameArray;

  var productNumberArray = Object.values(db.get("sessions").find({ id: sessionid }).get("cart").value() || "");
  res.locals.productNumberArray = productNumberArray;
  let count = 0;
  productNumberArray.forEach(element => {
  count = count + parseInt(element);
 })
 res.locals.count = count;
  next();
};