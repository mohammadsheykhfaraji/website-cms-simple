const Yup = require("yup");

exports.schema = Yup.object().shape({
    title: Yup.string().required("عنوان الزامی میباشد").min(5, "عنوان نباید از 5 کاراکتر کمتر باشد").max(100, "عنوان نباید از 100 کاراکتر بیشتر باشد"),
    body: Yup.string().required("محتوا الزامی میباشد"),
    status: Yup.mixed().oneOf(  ["public", "private"] ,"یکی از دو وضعیت عمومی و یا خصوصی را انتخاب کنید!!"),
    thumbnail:Yup.object().shape({
      name:Yup.string().required("عکس بند انگشتی الزامی است!"),
      size:Yup.number().max(3000000,"عکس نباید بیشتر از 3 مگابایت باشد"),
      mimeType:Yup.mixed().oneOf(["image/jpeg","image/png"],"تنها پسوند های png و jpeg پشتیبانی میشود!"),
    }),
  });