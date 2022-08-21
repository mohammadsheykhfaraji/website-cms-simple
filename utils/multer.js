const multer=require('multer');
const  uuid=require('uuid').v4;

exports.storege=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,`${uuid()}_${file.originalname}`);
    },
});

exports.fillefilter=(req,file,cb)=>{
    if(file.mimetype=="image/jpeg"){
        cb(null,true);
    }else{
        cb("تنها پسوند jpeg پشتیبانی میشود",false);
    }
}