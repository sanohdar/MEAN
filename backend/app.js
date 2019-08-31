const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
        'GET, POST, DELETE, OPTIONS')
    next();
});

app.post('/api/posts',(req,res,next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message:'New Post Added.'
    })
})

app.get('/api/posts',(req,res,next) => {
    var posts = [
            {
                id:'kjahdkajds78',
                title:'Fisrt Posts',
                content:'Brotherhood Empire the State.'
            },
            {
                id:'kjahdkajds78',
                title:'Second Posts',
                content:'Going to melinium, Empire the State!!.'
            }
        ];
    res.status(200).json({
        message:'Posts on the way',
        posts:posts
    })
});

module.exports = app;