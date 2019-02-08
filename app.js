var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator/check');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectID;

// Initial and set express function
var app = express();

/*
// middleware , will process before route /. It will process each request that client sent
var logger = function(req, res, next) {
    console.log('Logging...');
    next();
}

app.use(logger);
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  // tham số truyền  vào là 1 object

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// lỗi khi trang load trang index.ejs chưa tồn tại biến errors. Đây là cách xử lý thứ 1
// Global Vars
app.use(function(req, res, next) {
    res.locals.errors = null;
    next();
})
// cách thứ 2 ta truyền giá trị errors: false tới view index.js như bên dưới

/*
var users = [
    { id: 1, lastName : 'chuong', firstName : 'nguyen', email : 'chuongnt@basebs.com' },
    { id: 2, lastName : 'phuoc', firstName : 'nguyen', email : 'phuocnt@basebs.com' },
    { id: 3, lastName : 'vien', firstName : 'dang', email : 'viendq@basebs.com' },
    { id: 4, lastName : 'tay', firstName : 'huynh', email : 'tayh@basebs.com' }
]

// add route /
app.get('/', function(req, res) {
    //res.send('<h1>Hello world</h1>')
    res.render('index', {
        title: 'Customers',
        users: users,
        errors: false   // dùng cách thứ 2 xử lý lỗi errors is not defined in template ejs, cách này thì ta set mặc định giá trị của biến errors xuống là false 
    });
});
*/

app.get('/', function(req, res) {
    db.users.find(function (err, docs) {
        //console.log(docs);    // test
        res.render('index', {
            title: 'Customers',
            users: docs,
            errors: false
        })
    }); 
});

app.post('/users/add', [
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('firstName', 'First Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail().withMessage('Invalid email')
        .not().isEmpty()
],function(req, res) {
    // console.log('Form submit');
    //console.log(req.body.firstName); 
    
    const errors = validationResult(req);

    // if error, return index.js with error
    if (!errors.isEmpty()) {
        console.log('have error');
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors.array()
        });
    }

    // if not error, get value and handle 
    var newUser = {
        lastName : req.body.lastName,
        firstName : req.body.firstName,
        email : req.body.email
    }
    console.log(newUser) 

    db.users.insert(newUser, function(err, result) {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.delete('/users/delete/:id', function(req, res) {
    // console.log(req.params.id);
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, function(){
    console.log('Server Started on Port 3000...');
});