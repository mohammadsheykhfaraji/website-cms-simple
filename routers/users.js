const express=require('express');


const usercontrol = require('../controllers/usercontroller');
const {authenticated}=require('../middlewares/auth');


const router=express.Router(); 




////login page
/////////get /users/login
router.get("/login",usercontrol.login);


////login handle
/////////post /users/login
router.post("/login",usercontrol.handlelogin,usercontrol.remmemberme);


////logout handle
/////////get /users/logout
router.get("/logout",authenticated,usercontrol.logout);



////register page
/////////get /users/register
router.get("/register",usercontrol.register);

////register handel
/////////post /users/register
router.post("/register",usercontrol.createuser);

module.exports=router;



