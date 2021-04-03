'use strict';

var mysql=require('mysql');

//locall mysql db connection
var connection = mysql.createConnection({
    host     :'localhost',
    user     : 'root',
    password : 'password',
    database : 'librarydb'
});

connection.connect(function(err){
    if (err) throw err;
     console.log("DB connection successful");
    });

module.exports=connection;