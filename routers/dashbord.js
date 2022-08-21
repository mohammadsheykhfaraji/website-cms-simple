const express=require('express');
const {authenticated}=require('../middlewares/auth');
const admincontroller=require('../controllers/admincontroller');

const router=express.Router();

////dashbord page 
router.get("/",authenticated,admincontroller.getdashboard);

////dashbord addpost page 
////////get addpost
router.get("/add-post",authenticated,admincontroller.getAddpost);


////dashbord editpost/:id page 
////////get editpost
router.get("/edit-post/:id",authenticated,admincontroller.geteditpost);


////dashbord editpost/:id page 
////////get editpost
router.get("/delete-post/:id",authenticated,admincontroller.deletepost);



///dashbord addpost page 
////////post addpost
router.post("/add-post",authenticated,admincontroller.createpost);


///dashbord editpost page 
////////post editpost/:id
router.post("/edit-post/:id",authenticated,admincontroller.editpost);


///dashbord addpost image upload
////////post imageupload
router.post("/image-upload",authenticated,admincontroller.uploadimage);



module.exports=router;
