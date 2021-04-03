var express = require('express');
var router = express.Router();
const sql =require('../db');
const Joi=require('joi');
const { ValidationError } = require('joi');
const validator =require('express-joi-validation').createValidator({passError:true});

/* GET members listing. */
router.get('/', function(req, res, next) {
  sql.query("select * from members",function(error,results,fields){
    if(error)
           { 
               next(error);
               return;
           }
    res.json(results);
 // res.send('respond with a resource');
});
});
//Get member by Id
router.get('/:id', function(req, res, next) {
  sql.query("select * from members where id=?", [req.params.id],function(error,results,fields){
    if(error)
    { 
        next(error);
        return;
    }
    res.json(results);
 // res.send('respond with a resource');
});
});

 //Get member by name
 router.get('/member/:name', function(req, res, next) {
  var str='%'+[req.params.name]+'%';
    sql.query("select * from members where name LIKE ?",str,function(error,results,fields){
      if(error)
      { 
          next(error);
          return;
      }
      res.json(results);
   // res.send('respond with a resource');
  });
  });

//validation:
const validationSchema=Joi.object({
  name:Joi.string().min(3).max(30).required(),
  phone:Joi.string().min(3).max(30).required(),
  email: Joi.string().regex(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/).required(),
  address:Joi.string().min(3).max(50).required()
  

});
//POST API to create a new member
router.post('/', validator.body(validationSchema), function(req, res) {
  const data = req.body;
  sql.query('INSERT INTO members SET ?', data, function(error, results, fields) {
      
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).send({
          message: "User already exists. Please  use another email."
        });
      }
      next(error);
      return;
    }
      res.json(results);
  });
});

//Delete API to Delete a member by id
router.delete('/:id',function(req,res,next){
  sql.query('DELETE FROM members WHERE id=?', [req.params.id], function(error, results, fields) {
    if(error)
    { 
        next(error);
        return;
    }
  res.end('Record has been deleted!');
  });
});


 //edit one member by id 
 router.put('/:id', validator.body(validationSchema),function(req,res,next){
  console.log(req.params);
   sql.query('UPDATE members SET name=?, phone=?, email=?, address=? where id=?', [req.body.name, req.body.phone, req.body.email,req.body.address, req.params.id], function(error, results, fields) {
    if(error)
    { 
        next(error);
        return;
    }
     res.json(results);
});
});


module.exports = router;
