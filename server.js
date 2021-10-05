require('dotenv').config()
var express = require("express")
var app = express()
const MongoClient = require('mongodb').MongoClient;
let projectCollection;

const uri = "mongodb+srv://sit725-2021-t2:zI9YQ7KiprxVZ3Us@sit725.jzgkz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri,{ useNewUrlParser: true})


app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const createColllection = (collectionName) => {
    client.connect((err,db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
} 



const insertProjects = (project,callback) => {
    projectCollection.insert(project,callback);
}

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

app.get('/api/projects',(req,res) => {
    getProjects((err,result) => {
        if(err) {
            res.json({statusCode: 400, message:err})
        }
        else {
             res.json({statusCode: 200, message:"Success", data: result})
        }
     })
    //res.json({statusCode: 200, data: cardList, message:"Success"})
})

app.post('/api/projects',(req,res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    //cardList.push(newProject);
    insertProjects(newProject,(err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
      }
        else {
            res.json({statusCode: 200, message:"Project Successfully addedd", data: result})
        }
     })
    //res.json({statusCode: 200, message:"Project Successfully added", data: newProject})
})



var port = process.env.port || 3000;

app.listen(port, () => {
    console.log("App listening to: " + port);
    createColllection("To do list")
})
