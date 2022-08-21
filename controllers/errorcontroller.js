exports.get404=(req,res)=>{
    res.render("errors/404",{
        title:"404",
        path:"/404",
    });
}




exports.get500=(req,res)=>{
    res.render("errors/500",{
        path:"/404",
        title:"500", 
    });
}
