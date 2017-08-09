const mongoose = require('mongoose');
const documentSchema = require('./schemas/document.js');
const Document = mongoose.model('Document', documentSchema);
mongoose.connect('mongodb://localhost/documents', {useMongoClient: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
    distinct();
});

function distinct(){
    Document.distinct('locationID', function(err, result){
        if(err){
            console.error(err);
        } else {
            console.log(result);
        }
        process.exit(0);
    });
}

function create(){

    let document = new Document({
        name: 'test3.txt',
        locationID: '654321',
        active: true,
        binary: new Buffer('TERST')
    });
    document.save(function(err){
        if(err){
            console.log(err);
        }
        process.exit(0);
    });

    
}

function retrieve(){
    Document.find({locationID:'123456'}, function(err,documents){
        if(err){
            return console.error(err);
        }
        for(let i = 0; i < documents.length; i++){
            let document = documents[i];
            console.log(document.binary.toString());
        }
        process.exit(0);
    });
}