const express = require("express");
const multer = require('multer');
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
const path = require('path')

const key = require("./keys")

const AWS_ID = key.AWS_ID;
const AWS_SECRET = key.AWS_SECRET;
const AWS_BUCKET_NAME = key.AWS_BUCKET_NAME;

console.log(AWS_ID)



// const uuid = uuidv4()

const app = express();
require('dotenv').config({path: path.join(__dirname, '.env')});


const  port = 3000

const s3 = new AWS.S3({
    accessKeyId:AWS_ID,
    secretAccessKey:AWS_SECRET
})

const storage = multer.memoryStorage({
    destination:function(req,file,callback){
        callback(null, '')
    }
})

const  upload = multer({storage}).single('image')

app.post('/upload',upload, (req,res) =>{

    let myFile = req.file.originalname.split(".")
    const fileType=myFile[myFile.length-1]

    const params = {
        Bucket:AWS_BUCKET_NAME,
        Key:`${uuidv4()}.${fileType}`,
        Body:req.file.buffer
    }

    s3.upload(params,(error,data) =>{
        if(error){
            res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

app.get("/products",(req,res) =>{
    res.send([
        {
            productId:"101",
            price:100
        },
        {
            productId:"102",
            price:101
        }
    ])
})

app.get("/",(req,res) =>{
    res.send("<h1>Test app deploy test</h1>")
})


app.listen(port,() =>{
    console.log(`Server is starting at ${port}`)
})