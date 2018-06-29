const express = require ('express');
const app = express();
const morgan= require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
var path =require('path');

//routes
const userRoutes = require('./api/routes/user');
const projectRoutes = require('./api/routes/project');
const projectMemberRoutes = require('./api/routes/project_members');
const projectFileRoutes = require('./api/routes/project_file');
const TasksRoutes = require('./api/routes/tasks');

//DB connection
mongoose.connect('mongodb+srv://User:' + process.env.MONGO_ATLAS_PW +'@DBURl/DBname');
//mongoose.connect('mongodb://localhost:27017/TeamWorkDB');

mongoose.connection.on('connected',() =>{
    console.log('DB connected');
});

mongoose.connection.on('error',(err) =>{
    if(err)
    {
        console.log('error in DB connection : '+err);
    }
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

//body parser
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


//Handling Cores
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

// static files
app.use(express.static(path.join(__dirname,'public')));

//request handling routes
  app.use('/user', userRoutes);  
  app.use('/project', projectRoutes);
  app.use('/project_members', projectMemberRoutes);
  app.use('/project_file', projectFileRoutes);
  app.use('/tasks', TasksRoutes);

//404 error
  app.use((req, res, next) =>{
    const error= new Error('Not Found');
    error.status= 404;
    next(error);
})


app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;