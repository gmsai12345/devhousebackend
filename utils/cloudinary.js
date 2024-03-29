const cloudinary = require('cloudinary')
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


uploadToCloudinary = (path, folder) => {
    return cloudinary.v2.uploader.upload(path, {
        folder
    }).then((data) => {
        return { url: data.url };
    }).catch((error) => {
        console.log(error)
    })
}


module.exports = { uploadToCloudinary }