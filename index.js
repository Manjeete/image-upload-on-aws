const express = require("express");
const multer = require('multer');
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const mongoose = require('mongoose')
const Profile = require('./models/profileModel');
const bodyParser = require('body-parser')

const key = require("./keys")

const AWS_ID = key.AWS_ID;
const AWS_SECRET = key.AWS_SECRET;
const AWS_BUCKET_NAME = key.AWS_BUCKET_NAME;
const DATABASE_CLOUD = key.DATABASE_CLOUD



mongoose.connect(DATABASE_CLOUD,{useNewUrlParser:true,useUnifiedTopology: true })
.then(() => console.log('DB Connected...'))


// const uuid = uuidv4()

const app = express();
require('dotenv').config({path: path.join(__dirname, '.env')});

app.use(bodyParser.json())
// app.use(cookieParser())
// app.use(cors());


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

app.post('/profile',async(req,res) =>{
    let {name,email} = req.body;
    const newProfile = await Profile.create({name:name,email:email})

    return res.status(201).json({
        status:'success',
        data:{
            newProfile
        }
    })
})


app.listen(port,() =>{
    console.log(`Server is starting at ${port}`)
})