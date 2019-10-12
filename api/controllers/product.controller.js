var Product = require('../../models/product.model');

module.exports.index = async (req, res) => {
   var products = await Product.find();
   res.json(products);
} ;

module.exports.create = async (req,res) =>{
	var product = await Product.create(req.body);
	res.json(product);
};

/*export function get_skills(req, res){
     console.log('get_skills');
     var page = req.body.page; // 1 or 2
     var size = req.body.size; // 5 or 10 per page
     var query = {};
     if(page < 0 || page === 0)
     {
        result = {'status': 401,'message':'invalid page number,should start with 1'};
        return res.json(result);
     }
     query.skip = size * (page - 1)
     query.limit = size
     Skills.count({},function(err1,tot_count){ //to get the total count of skills
      if(err1)
      {
         res.json({
            status: 401,
            message:'something went wrong!',
            err: err,
         })
      }
      else 
      {
         Skills.find({},{},query).sort({'name':1}).exec(function(err,skill_doc){
             if(!err)
             {
                 res.json({
                     status: 200,
                     message:'Skills list',
                     data: data,
                     tot_count: tot_count,
                 })
             }
             else
             {
                 res.json({
                      status: 401,
                      message: 'something went wrong',
                      err: err
                 })
             }
        }) //Skills.find end
    }
 });//Skills.count end
 */