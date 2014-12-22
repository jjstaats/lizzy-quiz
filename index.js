var express = require('express');

var bodyParser = require('body-parser');

var db = require('mongoskin').db('mongodb://localhost:27017/quiz', {safe: true});

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

db.bind('states')

app.get('/state', function (request, response) {

    db.states.findOne({current:"state2"}, function(err, result) {
        if (err) response.json({message:err.message});

        if (result != null)  {
            response.json(result.body);
        } else {
            response.json({message:"Quiz master has not yet started!"})
        }

    });
});

app.post('/state', function (request, response) {

    db.states.findOne({current:"state2"}, function(err, result) {
        if (err) response.json({message:err.message});
        if (result != null) {
            db.states.update({_id:result._id}, {$set:{body:request.body}}, function(err, result) {
                if (err) response.json({message:err.message});
                response.json(request.body);
            });
        } else {
            db.states.insert({current:"state2", body:request.body}, function(err, result) {
                if (err) response.json({message:err.message});
                response.json(request.body);
            });
        }
    });
});

app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'));
});
