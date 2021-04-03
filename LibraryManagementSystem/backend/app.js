var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors');
var indexRouter = require('./routes/index');
var membersRouter = require('./routes/members');
var booksRouter = require('./routes/books');
var borrowsRouter = require('./routes/borrows');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/members', membersRouter);
app.use('/books', booksRouter);
app.use('/borrows', borrowsRouter);

app.use((err, req, resp, next) => {
    console.error(err);

    // Check for joi errors
    if (err && err.error && err.error.isJoi) {
        resp.status(400).json({
            message: err.error.toString(),
            error: err.message
        });
    }
    //  Other errors generated in the system
    else {
        resp.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }

})
module.exports = app;
