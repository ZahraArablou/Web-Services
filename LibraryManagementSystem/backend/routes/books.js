var express = require('express');
var router = express.Router();
const sql =require('../db');
const Joi=require('joi');
const validator =require('express-joi-validation').createValidator({passError:true});

/* GET books listing. */
router.get('/', function(req, res, next) {
  sql.query("select id,name,author,publish,DATE_FORMAT(pubDate, '%Y %M, %D') as 'pubDate', concat(price,'$') as 'price',quantity from books order by name",function(error,results,fields){
    if(error)
    { 
        next(error);
        return;
    }
    res.json(results);
 // res.send('respond with a resource');
});
});


//Get book by Id
router.get('/:id', function(req, res, next) {
    sql.query("select id,name,author,publish,DATE_FORMAT(pubDate,'%Y-%m-%d') as 'pubDate', concat(price,'$') as 'price',quantity from books where id=?", [req.params.id],function(error,results,fields){
      if(error)
      { 
          next(error);
          return;
      }
      res.json(results);
   // res.send('respond with a resource');
  });
  });


  //Get book by name
router.get('/book/:name', function(req, res, next) {
  var str='%'+[req.params.name]+'%';
    sql.query("select id,name,author,publish,DATE_FORMAT(pubDate,'%Y-%m-%d') as 'pubDate', concat(price,'$') as 'price',quantity from books where name LIKE ? order by name",str,function(error,results,fields){
      if(error)
      { 
          next(error);
          return;
      }
      res.json(results);
   // res.send('respond with a resource');
  });
  });

//******************** Validation part ***************************

const validationSchema=Joi.object({
  name:Joi.string().min(1).max(30).required(),
  author: Joi.string().min(3).max(30).required(),
  publish: Joi.string().min(2).max(30).required(),
  pubDate:Joi.date().required(),
  price:Joi.number().required(),
  quantity:Joi.required(),
 
});

//POST API to create a new book
router.post('/',validator.body(validationSchema), function(req, res,next) {
    const data = req.body;
    sql.query('INSERT INTO books SET ?', data, function(error, results, fields) {
      if(error)
                 { 
                     next(error);
                     return;
                 }
        res.json(results);
    });
});

//Delete API to Delete a book by id
router.delete('/:id',function(req,res,next){
      sql.query('DELETE FROM books WHERE id=?', [req.params.id], function(error, results, fields) {
        if(error)
        { 
            next(error);
            return;
        }
      res.end('Record has been deleted!');
      });
  });
  
  
   //edit one books by id 
   router.put('/:id',validator.body(validationSchema),function(req,res,next){
    console.log(req.params);
     sql.query('UPDATE books SET name=?, author=?, publish=?, pubDate=?,price=?,quantity=? where id=?', [req.body.name, req.body.author, req.body.publish,req.body.pubDate, req.body.price,req.body.quantity, req.params.id], function(error, results, fields) {
      if(error)
      { 
          next(error);
          return;
      }
       res.json(results);
 });
});

//change quantity when the book Issued
router.patch('/:id/:qty',function(req,res,next){
  console.log(req.params);
   sql.query('UPDATE books SET quantity=? where id=?', [req.params.qty, req.params.id], function(error, results, fields) {
    if(error)
    { 
        next(error);
        return;
    }
     res.json(results);
});
});

 
module.exports = router;
