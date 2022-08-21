const fs=require('fs');

const multer=require('multer');
const sharp=require('sharp');
const shortid=require('shortid');
const approot=require('app-root-path');

const blog=require('../models/blog');
const{formatdate}=require('../utils/jalali');
const {get500}=require('./errorcontroller');

const{fillefilter}=require('../utils/multer');

exports.getdashboard=async(req,res)=>{
        const page= +req.query.page || 1;
        const postperpage=10;
    try {
        const numberofpost=await blog.find({user:req.user.id}).countDocuments();
        const blogs=await blog.find({user:req.user.id}).skip((page-1)*postperpage).limit(postperpage);        

        res.render("admin/blogs",{
            title:"بخش مدیریت",
            path:"/dashboard",
            layout:"./layouts/dashlayout",
            fullname:req.user.fullname,
            blogs,
            formatdate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postperpage * page < numberofpost,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberofpost / postperpage),
        });
    } catch (err) {
        console.log(err);
        get500(req,res);
    }

}

exports.getAddpost=(req,res)=>{
    res.render("admin/addpost",{
        title:"بخش مدیریت | ساخت پست جدید",
        path:"/dashboard/add-post",
        layout:"./layouts/dashlayout",
        fullname:req.user.fullname,
    });

}
exports.geteditpost=async(req,res)=>{
    const post=await blog.findOne({_id:req.params.id});
    
    if(!post){
       return res.redirect("errors/404");
    }
    if(post.user.toString()!==req.user.id){
        return res.redirect("/dashboard");
    }else{
        res.render("admin/editpost",{
            title:"بخش مدیریت | ویرایش پست",
            path:"/dashboard/edit-post",
            layout:"./layouts/dashlayout",
            fullname:req.user.fullname,
            post,
        });
    }
}

exports.editpost=async(req,res)=>{
    const errors=[];

    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortid.generate()}_${thumbnail.name}`;
    const uploadPath = `${approot}/public/uploads/thumbnail/${fileName}`;


    const post =await blog.findOne({_id:req.params.id});
    try { 

        if(thumbnail.name){
            await blog.postValidation({...req.body,thumbnail});
        }else{
            await blog.postValidation({...req.body,thumbnail:{name:"placeholder",size:0,mimetype:"image/jpeg"}});
        }

        // await blog.postValidation(req.body);
        if(!post){
            return res.redirect("errors/404");
         }
         if(post.user.toString()!==req.user.id){
             return res.redirect("/dashboard");
         }else{

            if(thumbnail.name){
                fs.unlink(`${approot}/public/uploads/thumbnail/${post.thumbnail}`,async(err)=>{
                    if(err){console.log(err);}
                    else{
                        await sharp(thumbnail.data).jpeg({quality:60}).toFile(uploadPath).catch((err)=>{console.log(err);});
                    }
                });
            }


           
             const{title,status,body}=req.body;
             post.title=title;
             post.status=status;
             post.body=body;
             post.thumbnail=thumbnail.name ? fileName :post.thumbnail;

             await post.save();
             return  res.redirect("/dashboard");
         }
       
    } catch (err) {
        console.log(err);
       
        err.inner.forEach(e=>{
            errors.push({
                name:e.path,
                message:e.message,
            });
        });

        res.render("admin/editpost",{
            title:"بخش مدیریت | ویرایش پست",
            path:"/dashboard/edit-post",
            layout:"./layouts/dashlayout",
            fullname:req.user.fullname,
            errors,
            post,
        });
    }
}

exports.deletepost=async(req,res)=>{
    try {
        await blog.findByIdAndRemove(req.params.id);
        res.redirect("/dashboard");
    } catch (err) {
        res.render("errors/500");
    }
   
}

exports.createpost=async(req,res)=>{
    const errors=[];

    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortid.generate()}_${thumbnail.name}`;
    const uploadPath = `${approot}/public/uploads/thumbnail/${fileName}`;


    try { 
        req.body={...req.body,thumbnail}
        await blog.postValidation(req.body);

        await sharp(thumbnail.data).jpeg({quality:60}).toFile(uploadPath).catch((err)=>{console.log(err);});

        await  blog.create({...req.body,user:req.user.id,thumbnail:fileName});
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
       
        err.inner.forEach(e=>{
            errors.push({
                name:e.path,
                message:e.message,
            });
        });

        res.render("admin/addpost",{
            title:"بخش مدیریت | ساخت پست جدید",
            path:"/dashboard/add-post",
            layout:"./layouts/dashlayout",
            fullname:req.user.fullname,
            errors,
        });
    }
}


exports.uploadimage=(req,res)=>{
   
    const upload=multer({
        limits:{fileSize:4000000},
        // dest:"uploads/",
        // storage:storege,
        fileFilter:fillefilter,
    }).single("image");
console.log("in1");

    upload(req,res,async(err)=>{
     console.log(req.files);
     
         if(err){
             if(err.code==="LIMIT_FILE_SIZE"){
                return res.send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد!!");
             }
             res.status(400).send(err);
         }else{
             if(req.files){
                let filename=`${shortid.generate()}_${req.files.image.name}`;
                await sharp(req.files.image.data).jpeg({
                    quality:50,
                }).toFile(`./public/uploads/${filename}`).catch((err)=>{
                    console.log(err);
                });
               
                res.status(200).send(`http://localhost:3000/uploads/${filename}`);
             }else{
                 res.send("جهت اپلود باید عکسی انتخاب کنید");
             }
         }
    });
}
