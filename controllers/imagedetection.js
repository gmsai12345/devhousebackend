exports.imagedetection=async(req,res)=>
{
    const {imageurl}=req.body;
    const axios = require("axios").default;
const options = {
  method: "POST",
  url: "https://api.edenai.run/v2/image/face_detection",
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDIzODA3MTYtZDU3Yi00ZWMxLThhZjItNGEzYjVkMmVkNTFiIiwidHlwZSI6ImFwaV90b2tlbiJ9.e5HlHC5DZI6zYafBj-J3F492C-L4C83-VP5OwNzHn4w",
  },
  data: {
  providers: "picpurify",
    file_url: imageurl,
    fallback_providers: "",
  },
};
axios
  .request(options)
  .then((response) => {
    console.log(response.data)
    const data = response.data;
    const { picpurify: { items: [{ gender }] } } = data;
    console.log("Gender:", gender);
    if(gender=="male")
    {
        res.status(401).json("not female");
    }
    else
    {
        res.status(200).json("female");
    } 
  })
  .catch((error) => {
    console.error(error);
  });

}