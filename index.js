const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoose = require('mongoose');
const documentSchema = require('./schemas/document.js');
const Document = mongoose.model('Document', documentSchema);
mongoose.connect('mongodb://localhost/documents', {useMongoClient: true});
let db = mongoose.connection;

let multer = require('multer');
let storage = multer.memoryStorage();
let multipart = multer({storage:storage}).any();

let app = express();

app.use(morgan('dev'));

app.use(multipart);

app.use(express.static('./public'));

app.post('/upload', function(req,res){
    let doc = new Document({
        name: req.body.filename,
        locationID: req.body.locationid,
        binary: req.files[0].buffer
    });

    doc.save(function(err){
        if(err){
            return res.status(500).send(err);
        }
        return res.status(200).send('success');
    });
});

app.get('/locations', function(req,res){
    Document.distinct('locationID', function(err,result){
        if(err){
            return res.status(500).send(err);
        }
        console.log(result);
        return res.status(200).send(result);
    });
});

app.get('/:locationID', function(req, res){
    Document.find({locationID: req.params.locationID}, function(err,documents){
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(documents.map(function(doc){
            return {name: doc.name, locationID: doc.locationID, uploadDate: doc.uploadDate};
        }));
    });
});

app.get('/:locationID/:fileName', function(req, res){
    Document.find({locationID: req.params.locationID, name: req.params.fileName}, function(err,documents){
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(documents[0].binary);
    });
});

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    app.listen(80, function(err){
        if(err){
            console.log(err);
            process.exit(0);
        }
        console.log('listening: 80');
    });
});
