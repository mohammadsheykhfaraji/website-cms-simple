const winston =require('winston');
const RootPath = require('app-root-path');



const option={
    File:{
      level:"info" ,
       filename:`${RootPath}/logs/app.log`,
       handleExceptions:true,
       format:winston.format.json(),
       maxsize:5000000,
       maxFile:5
    },
    console:{
        level:"debug",
        handleExceptions:true,
        format:winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
    }
}




const logger=new winston.createLogger({
    transports:[
        new winston.transports.File(option.File),
        new winston.transports.Console(option.console),
    ],
    exitOnError:false,
});

logger.stream={
    write:function(message){
        logger.info(message);
    },
};

module.exports=logger;
