const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/posts');

const app = express();

mongoose.connect(
    'mongodb+srv://sandeep:WfzkR4NWzBPcSRef@mstar-mksq1.mongodb.net/MEAN?retryWrites=true&w=majority',
    { useNewUrlParser: true }
    ).then(() => {
        console.log('Connected to MongoDB cloud.')
    }).catch(() => {
    console.log('MongoDB Not Reachable.')
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, DELETE, PUT, OPTIONS')
    next();
});

app.post('/api/posts',(req,res,next) => {
    const post = new Post({
        title:req.body.title,
        content: req.body.content
    })
    post.save();
    console.log('post',post)
    res.status(201).json({
        message:'New Post Added.',
        id:'d6afdigka'
    })
})

app.get('/api/posts',(req,res,next) => {

    console.log('Reaching mongoDB')
    Post.find()
    .then(documents => {

        res.status(200).json({
        message:'Posts on the way',
        posts:documents
        })
    })

});

app.put('/edit',(req,res,next) => {

    let postToEdit = {
        title:req.body.title,
        content:req.body.content,
        _id:req.body.id
    }
    Post.updateOne({_id:req.body.id},postToEdit,(err,resMongo) => {
        if(!err){
            console.log('mongo res',resMongo)
            res.status(201).json({message:'Editing Complete'})
        }else{
            res.status(500).json({message:'Error accured'})
        }
    })
})

app.delete('/api/posts/:id',(req,res,next) => {

    Post.deleteOne({_id:req.params.id},(err,resMessage) => {
        if(!err){
            res.status(200).json({message:'Post deleted'});
        }else{
            console.log('Error while deleting the posts',err);
        }
    })
})

module.exports = app;