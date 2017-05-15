const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
// create client
const client = redis.createClient();

client.on("connect", ()=> {
    console.log("redis server connected");
});


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
  let title = 'Tech Brain Task-list';
  client.lrange('tasks', 0, -1, (err, reply)=>{
      res.render('index',{
        title: title,
        tasks: reply
      });
  });
});

app.post('/task/add', (req, res) => {
   let task = req.body.task;

   client.rpush('tasks', task, (err, reply) => {
     if(err){
       console.log(err);
     }
       console.log('task added .....');
       res.redirect('/')
   })
})

app.listen(3000,()=>{
  console.log('Server started at 3000');
})
module.exports = app;
