const moment=require('jalali-moment');


exports.formatdate=(date)=>{
    return moment(date).locale("fa").format("D MMM YYYY");
}