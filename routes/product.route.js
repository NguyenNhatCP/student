var express = require('express');
var multer = require('multer');

var upload = multer({ dest: './public/uploads'});
var router = express.Router();

var controller = require('../controllers/product.controller');

router.get('/', controller.index);
router.get('/admin-product', controller.view);

router.get('/search',controller.search);
router.get('/add-product',controller.add);
router.post('/add-product',
	upload.single('image'),
	controller.addProduct);

module.exports = router;
