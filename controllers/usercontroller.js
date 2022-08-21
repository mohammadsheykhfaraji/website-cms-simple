const User=require('../models/user');

const {sendEmail}=require('../utils/mailer');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const passport=require('passport');


exports.login=(req,res)=>{
    res.render("login",{
        title:"ورود" ,
        path:"/login",
        message:req.flash("success_msg"),
        error:req.flash("error"),

    });
}

exports.handlelogin=async(req,res,next)=>{
   
    if(!req.body["g-recaptcha-response"]){
        req.flash("error","اعتبار سنجی الزامی است!! ");
        return res.redirect("/users/login");
    }



    const secretkey=process.env.CAPTCHA_SECRET;
    const verifyurl=`https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;
   
   const response=await fetch(verifyurl,{
        method: 'post',
        
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'
        }
   });
  
   const json=await response.json();

   if(json.success){
        passport.authenticate("local",{
            failureRedirect:"/users/login",
            failureFlash:true,
        })(req,res,next);
   }else{
        req.flash("error","در اعتبار سنجی مشکلی پیش امده است!!");
        return res.redirect("/users/login");
   }

    
   
}

exports.remmemberme=(req,res)=>{
    if(req.body.remmember){
        req.session.cookie.originalMaxAge=24*60*60*1000;
    }else{
        req.session.cookie.expire=null;
    }
    res.redirect("/dashboard");
}

exports.logout=(req,res)=>{
    req.session=null;
    req.logout();
    // req.flash("success_msg"," خروج موفقیت امیز بود");
    res.redirect("/users/login");
}

exports.register=(req,res)=>{
    res.render("register",{
        title:"ثبت نام" ,
        path:"/register"
    });
}

exports.createuser=async (req,res)=>{ 
    const errors=[];
    try{
    await User.userValidation(req.body);
    const { fullname, email, password } = req.body;
    const user=await User.findOne({email:email}); 
    if(user){
        errors.push({message:"شما با این ایمیل قبلا ثبت نام کردید لطفا لاگین کنید"});
       return res.render("register",{
            title:"ثبت نام ",
            path:"/register",
            errors:errors
        });
    }

  
    await User.create({ fullname, email, password});
    // sendEmail(
    //     email,
    //     fullname,
    //     "خوش آمدی به وبلاگ ما",
    //     "خیلی خوشحالیم که به جمع ما وبلاگرهای خفن ملحق شدی"
    // );
    req.flash("success_mag","ثبت نام موفقتیت امیز بود");
    res.redirect("/users/login");


    
    }catch(err){
        console.log(err);
      
        err.inner.forEach(e=>{
            errors.push({
                name:e.path,
                message:e.message,
            });
        });

        res.render("register",{
            title:"ثبت نام ",
            path:"/register",
            errors:errors
        });
    }
}

