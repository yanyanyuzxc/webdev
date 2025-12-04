const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const fileRouter = require("./file");
const port = 3000;
app.use(express.static(__dirname));
app.use(express.json());
app.get("/", (req, res) => {
  res.redirect("/web/index.html");
});
app.use("/file", fileRouter);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("http://localhost:" + port);
});
