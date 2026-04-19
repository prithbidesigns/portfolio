const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getThumbnailUrl,
  isCloudinaryConfigured,
  uploadBuffer,
} = require("../utils/cloudinary");

const sanitizeFolder = (folder = "") =>
  folder
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/");

const cloudinaryUploadRoutes = (authenticateAdmin) => {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  router.post(
    "/upload",
    authenticateAdmin,
    upload.single("file"),
    async (req, res) => {
      try {
        if (!isCloudinaryConfigured()) {
          return res.status(500).json({
            message: "Cloudinary is not configured on the server.",
          });
        }

        const file = req.file;

        if (!file) {
          return res.status(400).json({ message: "No file uploaded." });
        }

        const folder = sanitizeFolder(req.body.folder);
        const baseName = path
          .parse(file.originalname)
          .name.replace(/[^a-zA-Z0-9-_]/g, "-");

        const uploadResult = await uploadBuffer(file.buffer, {
          folder: folder || undefined,
          public_id: `${Date.now()}-${baseName || "upload"}`,
        });

        res.status(200).json({
          url: uploadResult.secure_url,
          fileId: uploadResult.public_id,
          thumbnail: getThumbnailUrl(uploadResult),
        });
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
    }
  );

  return router;
};

module.exports = cloudinaryUploadRoutes;
