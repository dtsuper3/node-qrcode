const express = require("express");
const path = require("path");
const multer = require("multer");
const { qrcodeReader, qrcodeGenerate } = require("./utils/qrcodeHelper");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const upload = multer({
  // dest: "avatars",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  }
});

app.post("/qrcode/reader", upload.single("file"), async (req, res) => {
  const buffer = req.file.buffer;
  try {
    const value = await qrcodeReader(buffer);
    if (!value) {
      return res.send({ err: "Please select an QR Code image" });
    }
    res.send({ value });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
