const {cloudinary} = require('../config');

function uploadImage(image) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, (error, upload) => {
      if (error) {
        reject(`Upload image failed ${error.message}`);
      } else {
        resolve(upload);
      }
    });
  });
}

module.exports = {uploadImage};
