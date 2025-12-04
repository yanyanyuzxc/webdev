const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
router.get("/getUploadedChunks", (req, res) => {
  const uploadedChunks = [];
  res.json(uploadedChunks);
});

module.exports = router;
