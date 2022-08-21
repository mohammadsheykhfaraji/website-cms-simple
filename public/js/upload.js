document.getElementById("uploadimage").onclick = function () {
    let xhttp = new XMLHttpRequest(); // create new AJAX request

    const selectimage= document.getElementById("selectimage");
    const imagestatus= document.getElementById("imagestatus");
    const progresdiv = document.getElementById("progresdiv");
    const progressbar= document.getElementById("progressbar");
    const uploadresult=document.getElementById("uploadresult");
console.log(selectimage);
    xhttp.onreadystatechange = function () {
      
        if(xhttp.status===200){
           imagestatus.innerHTML="اپلود عکس موفقیت امیز بود";
           uploadresult.innerHTML=this.responseText; 
           selectimage.value="";
        }else{
           imagestatus.innerHTML = this.responseText;
        }
    };

    xhttp.open("post", "/dashboard/image-upload");

    xhttp.upload.onprogress=function(e){
        if(e.lengthComputable){
            let result=Math.floor((e.loaded/e.total)*100);
           
           if(result!==100){
                progressbar.innerHTML=result+"%";
                progressbar.style="width:"+result+"%";
           }else{
               progresdiv.style="display:none";
           }
            // console.log(result);
        }
    }




    let formData = new FormData();
console.log(selectimage);
   if(selectimage.files.length>0){
        progresdiv.style="display:block";
         formData.append("image", selectimage.files[0]);
         xhttp.send(formData);
    }else{
        imagestatus.innerHTML="برای اپلود باید عکسی انتخاب کنید";
    }
};
