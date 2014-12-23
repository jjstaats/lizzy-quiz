var express = require('express');
var cors = require('cors');

var bodyParser = require('body-parser');

var db = require('mongoskin').db((process.env.MONGOLAB_URI || 'mongodb://localhost:27017/quiz'), {safe: true});

var app = express();

var stateName = 'state3';

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors());
app.use(nocache);

db.bind('states');
db.bind('passwords');



app.get('/state', function (request, response) {
    db.states.findOne({current:stateName}, function(err, result) {
        if (err) response.json({message:err.message});

        if (result != null)  {
            response.json(result.body);
        } else {
            response.json({message:'Quiz master has not yet started!'})
        }
    });
});

app.post('/state/:pass', function (request, response) {

    db.passwords.findOne({current:stateName}, function(err, result){
        if (err) response.json({message:err.message});
        if (result != null)  {
            if(result.password === request.params.pass) {
                db.states.findOne({current:stateName}, function(err, result) {
                    if (err) response.json({message:err.message});
                    if (result != null) {
                        db.states.update({_id:result._id}, {$set:{body:request.body}}, function(err, result) {
                            if (err) response.json({message:err.message});
                            response.json(request.body);
                        });
                    } else {
                        db.states.insert({current:stateName, body:request.body}, function(err, result) {
                            if (err) response.json({message:err.message});
                            response.json(request.body);
                        });
                    }
                });
            } else {
                response.json({message:'Quiz master password wrong'})
            }
        } else {
            response.json({message:'Quiz master has not yet started!'})
        }
    });
});

app.post('/password', function (request, response) {

    db.passwords.findOne({current:stateName}, function(err, result) {
        if (err) response.json({message: err.message});
        if (result != null) {
            if(result.password !== '') {
                response.json({message:'Quiz master password already set.'})
            } else {
                db.passwords.update({_id: result._id}, {$set: {password: request.body.password}}, function (err, result) {
                    if (err) response.json({message: err.message});
                    response.json(request.body);
                });
            }
        } else {
            db.passwords.insert({current: stateName, password: ''}, function (err, result) {
                if (err) response.json({message: err.message});
                response.json(request.body);
            });
        }
    });
});

app.get('/restart', function (request, response) {

    db.passwords.findOne({current:stateName}, function(err, result) {
        if (err) response.json({message: err.message});
        if (result != null) {
            db.passwords.update({_id: result._id}, {$set: {password: ''}}, function (err, result) {
                if (err) response.json({message: err.message});
                response.json(request.body);
            });
        } else {
            db.passwords.insert({current: stateName, password: ''}, function (err, result) {
                if (err) response.json({message: err.message});
                response.json(request.body);
            });
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('Node app is running at localhost:' + app.get('port'));
});
