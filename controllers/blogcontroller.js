const blog=require('../models/blog');
const {formatdate}=require('../utils/jalali');
const {truncate}=require('../utils/helpers');

exports.getindex=async(req,res)=>{
    const page= +req.query.page || 1;
    const postperpage=5;
    try {
        const numberofpost=await blog.find({status:"public"}).countDocuments();
        const posts=await blog.find({status:"public"}).sort({createAt:"desc",}).skip((page-1)*postperpage).limit(postperpage);
        res.render("index",{
            title:"وبلاگ",
            path:"/",
            posts,
            formatdate,
            truncate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postperpage * page < numberofpost,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberofpost / postperpage),
        });

    } catch (err) {
        console.log(err);
        res.render("errors/500")
    }
}

exports.getsinglepost=async(req,res)=>{
    try {
        const post =await blog.findOne({_id:req.params.id}).populate("user");

        if(!post){ return res.redirect("errors/404");}

        res.render("post",{
            title:post.title,
            path:"/post",
            post,
            formatdate,
        });

    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
}