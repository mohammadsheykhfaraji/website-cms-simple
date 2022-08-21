
const mongoos=require('mongoose');


const conectdb=async()=>{
    
    try{
        const con=await mongoos.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
           ///// dont open this code///// useFindAndModify:true,
        });
        console.log(`mongodb conected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }


}


module.exports=conectdb;