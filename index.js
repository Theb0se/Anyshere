const express = require("express");
const multer = require("multer");
const connectDB = require("./config/db");
const app = express();
const File = require("./models/file");
require("dotenv").config();
const bcrypt = require("bcrypt");

connectDB();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

const upload = multer({ dest: "uploads" });

const port = 8080;

app.get("/", (req, res) => res.render("index", { filelink: null }));

// upload
app.post("/upload", upload.single("file"), async (req, res, next) => {
  const FileData = {
    path: req.file.path,
    orignalname: req.file.originalname,
  };

  if (req.body.password) {
    FileData.Password = await bcrypt.hash(req.body.password, 10);
  }
  const file = await File.create(FileData);
  res.render("index", { filelink: `${req.headers.origin}/file/${file.id}` });
});

// get file

app.route("/file/:id").get(handleDownload).post(handleDownload);

async function handleDownload(req, res) {
  const id = req.params.id;
  const file = await File.findById(id);
  console.log(req.body.password);

  if (file.Password != null) {
    if (req.body.password == null) {
      res.render("Password", { msg: null });
      console.log("1");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.Password))) {
      res.render("Password", { msg: "Incorrect Password" });
      console.log("3");
      return;
    }
  }

  file.downloadCount++;
  await file.save();
  res.download(file.path, file.orignalname);
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
