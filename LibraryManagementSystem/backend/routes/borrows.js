var express = require('express');
var router = express.Router();
const sql =require('../db');
const Joi=require('joi');
const { ValidationError } = require('joi');
const validator =require('express-joi-validation').createValidator({passError:true});

/* GET borrows listing. */
router.get('/', function(req, res, next) {
  sql.query("select id,memberId,bookId,DATE_FORMAT(issueDate, '%d %M, %Y') as 'issueDate',DATE_FORMAT(returnDate, '%d %M, %Y') as 'returnDate' from borrows",function(error,results,fields){
    if(error)
    { 
        next(error);
        return;
    }
    res.json(results);
 // res.send('respond with a resource');
});
});
//get borrowed books of a member which have been not returned yet.
router.get('/book/:id', function(req, res, next) {
  var queryStr="select  d.id as 'borrowId',b.id,b.quantity,b.name,b.author,DATE_FORMAT(d.issueDate, '%d %M, %Y') as 'issueDate',DATE_FORMAT(returnDate, '%d %M, %Y') as 'returnDate'  from borrows as d inner join members as m on d.memberId=m.id inner join books as b on d.bookId=b.id where d.memberId=?  and d.returnDate is null order by b.name ";
    sql.query(queryStr,[req.params.id],function(error,results,fields){
    if(error)
    { 
        next(error);
        return;
    }
    res.json(results);
 
});
});
//get borrowed books of a member for member history
router.get('/history/:id', function(req, res, next) {
  var queryStr="select  d.id as 'borrowId',b.id,b.quantity,b.name,b.author,DATE_FORMAT(d.issueDate, '%d %M, %Y') as 'issueDate',DATE_FORMAT(returnDate, '%d %M, %Y') as 'returnDate'  from borrows as d inner join members as m on d.memberId=m.id inner join books as b on d.bookId=b.id where d.memberId=? order by b.name ";
    sql.query(queryStr,[req.params.id],function(error,results,fields){
    if(error)
    { 
        next(error);
        return;
    }
    res.json(results);
 
});
});
//list of all borrowed books
router.get('/borrowedbook', function(req, res, next) {
  //var queryStr="select  d.id as 'borrowId',b.id,b.quantity,b.name,b.author,DATE_FORMAT(d.issueDate, '%d %M, %Y') as 'issueDate',DATE_FORMAT(returnDate, '%d %M, %Y') as 'returnDate'  from borrows as d inner join members as m on d.memberId=m.id inner join books as b on d.bookId=b.id where d.memberId=?  and d.returnDate is null order by b.name ";
  var queryStr="select b.id as 'bookId', b.name as 'bookName' ,b.author,m.name as 'memberName',DATE_FORMAT(bo.issueDate, '%d %M, %Y') as 'issueDate' from borrows as bo inner join books as b on bo.bookId=b.id inner join members as m on bo.memberId=m.id where bo.returnDate is null order by b.name";
  sql.query(queryStr,function(error,results,fields){
    if(error)
    { 
        next(error);
        return;
    }
    res.json(results);
 
});
});
//POST API to create a borrow (issue a book)
router.post('/', function(req, res,next) {
    const data = req.body;
    sql.query('INSERT INTO borrows SET ?', data, function(error, results, fields) {
      if(error)
           { 
               next(error);
               return;
           }
        res.json(results);
    });
});


//Delete API to Delete a member by id
router.delete('/:id',function(req,res,next){
    sql.query('DELETE FROM borrows WHERE id=?', [req.params.id], function(error, results, fields) {
      if(error)
      { 
          next(error);
          return;
      }
    res.end('Record has been deleted!');
    });
  });

  //change quantity when the book Issued
router.patch('/:id/:date',function(req,res,next){
  console.log(req.params);
   sql.query('UPDATE borrows SET returnDate=? where id=?', [req.params.date, req.params.id], function(error, results, fields) {
    if(error)
    { 
        next(error);
        return;
    }
     res.json(results);
});
});


module.exports = router;

