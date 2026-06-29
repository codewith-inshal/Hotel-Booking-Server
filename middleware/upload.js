const multer = require("multer");
const path = require("path");

// 1. Define where and how to store the file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists in your project root
  },
  filename: function (req, file, cb) {
    // Standard practice: timestamp + original name to avoid duplicates
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// 2. Filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and WebP are allowed."),
      false,
    );
  }
};

// 3. Export the middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
