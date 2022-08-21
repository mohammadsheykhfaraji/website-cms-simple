const path=require('path');


const debug=require('debug')("webpro");
const express=require('express');
const bodyparser=require('body-parser');
const fileupload=require('express-fileupload');
//const mongoose=require('mongoose');
const passport=require('passport');
const expressLayouts = require('express-ejs-layouts');
const dotenv=require('dotenv');
const morgan=require('morgan');
const flash=require('connect-flash');
const session=require('express-session');
const MongoStore = require("connect-mongo");

const connectdb=require('./config/db');
const winston=require('./config/winston');

dotenv.config({path:"./config/config.env"});

/////connectdb
connectdb();
debug("connect database");


////passport configrasion
require('./config/passport');



const app=express();


///views engine
app.use(expressLayouts);
app.set('view engine','ejs');
app.set("layout","./layouts/homelayout");


 
/////*bodyparser
// app.use(express.urlencoded({extended:false}));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());



////file upload
app.use(fileupload());


////session
app.use(session({
    secret:process.env.SESSOIN_SECRET,
    resave:false, 
    saveUninitialized:false,
    unset:"destroy",
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
}));


////passport
app.use(passport.initialize());
app.use(passport.session());

/////flash
app.use(flash());


/////loging

if(process.env.NODE_ENV==="development"){
  //  debug("morgan enable");
   // app.use(morgan('combined',{stream:winston.stream}));
}





///static
app.use(express.static(path.join(__dirname,'public')));



///routers
app.use("/",require('./routers/blog'));
app.use("/dashboard",require('./routers/dashbord'));
app.use("/users",require('./routers/users'));


app.use(require('./controllers/errorcontroller').get404);

const PORT=process.env.PORT || 3000 ;
app.listen(PORT,()=>{
    console.log(`server runing in ${process.env.NODE_ENV} listen port ${PORT}`);
});
