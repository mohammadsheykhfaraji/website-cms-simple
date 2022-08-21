const express=require('express');

const blogcontroller=require('../controllers/blogcontroller');
const router=express.Router();

/////get metod / routers
router.get("/",blogcontroller.getindex);


/////get metod /post/:id routers
router.get("/post/:id",blogcontroller.getsinglepost);






module.exports=router;
