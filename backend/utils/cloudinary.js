const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

const getThumbnailUrl = (uploadResult) => {
  if (!uploadResult?.public_id) {
    return uploadResult?.secure_url || "";
  }

  if (uploadResult.resource_type === "image") {
    return cloudinary.url(uploadResult.public_id, {
      secure: true,
      width: 800,
      height: 800,
      crop: "limit",
      quality: "auto:low",
      fetch_format: "auto",
    });
  }

  if (uploadResult.resource_type === "video") {
    return cloudinary.url(uploadResult.public_id, {
      secure: true,
      resource_type: "video",
      format: "jpg",
      start_offset: "50p",
      width: 900,
      height: 1600,
      crop: "fit",
      quality: "auto",
    });
  }

  return uploadResult.secure_url || "";
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBuffer,
  getThumbnailUrl,
};
