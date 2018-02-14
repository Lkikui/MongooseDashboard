/* ---------- modules ---------- */
//express
var express = require('express');
var app = express();

//mongoose
var mongoose = require('mongoose');

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//path
var path = require('path');

//static and views folders
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

/* ---------- database ---------- */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose_dashboard');

var WolfSchema = new mongoose.Schema ({
    name: {type: String, required: true, minlength: 2},
    age: {type: Number, required: true, minlength: 1},
    weight: {type: Number, required: true, minlength: 1}
});
mongoose.model('Wolf', WolfSchema);
var Wolf = mongoose.model('Wolf');

/* ---------- routes ---------- */
//renders index
app.get('/', function(req, res){
    Wolf.find({}, function(err, wolves){
        if(err){
            console.log('ERROR: query unsuccessful');
        } else {
            console.log('successfully filtered!');
            // console.log(wolves);
            res.render('index', {wolves: wolves});
        }
    })
});

//renders wolf profile 
app.get('/wolves/:id', function(req, res){
    Wolf.find({_id: req.params.id}, function(err, wolves){
        if(err){
            console.log('ERROR: query unsuccessful');
        } else {
            console.log('successfully filtered!');
            res.render('wolfProfile', {wolf: wolves[0]});
        }
    })
});

//renders form to create new entry
app.get('/new', function(req, res) {
    res.render('addNewWolf');
});

//creates new entries
app.post('/wolves', function(req,res){
    console.log("POST DATA", req.body);

    var wolf = new Wolf({name: req.body.name, age: req.body.age, weight: req.body.weight});
    wolf.save(function(err){
        if(err){
            console.log('something went wrong');
            res.render('addNewWolf', {errors: wolf.err})
        } else {
            console.log('successfully added a wolf!');
            res.redirect('/');
        }
    })
});

//renders form to edit entries
app.get('/wolves/edit/:id', function(req, res){
    Wolf.find({_id: req.params.id}, function(err, wolves){
        if(err){
            console.log('ERROR: query unsuccessful');
        } else {
            console.log('successfully filtered!');
            res.render('editWolf', {wolf: wolves[0]});
        }
    })
});

//updates edited entries
app.post('/editWolf/:id', function(req,res){
    console.log("EDIT POST DATA", req.body);
    Wolf.update({_id:req.params.id}, {$set: {name: req.body.name, age: req.body.age, weight: req.body.weight}}, function(err, wolves) {
        if(err) {
            console.log('ERROR: edit unsuccessful');
        } else {
            console.log('successfully edited!');
            console.log(req.params.id);
        }
    })
    res.redirect('/wolves/'+req.params.id);
});

//destroys entries
app.post('/wolves/destroy/:id', function(req, res){
    console.log("initiating delete");
    Wolf.remove({_id:req.params.id}, function(err, wolves){
        if(err) {
            console.log('Error: unable to delete');
        } else {
            console.log('successfully deleted');
        }
    })
    res.redirect('/');
})

/* ---------- port ---------- */
app.listen(8000, function(){
    console.log("MongooseDashboard Project listening on port 8000");
})