const fs = require("fs");
const QRCode = require("qrcode");
const QRReader = require("qrcode-reader");
const jimp = require("jimp");

// QRCode.toDataURL("I am a pony!", { errorCorrectionLevel: "H" }, function(
//   err,
//   url
// ) {
//   let base64Data = url.replace(/^data:image\/png;base64,/, "");
//   base64Data += base64Data.replace("+", " ");
//   let binaryData = new Buffer(base64Data, "base64").toString("binary");
//   fs.writeFile("out.png", binaryData, "binary", function(err) {
//     if (err) console.log(err);
//     console.log("QR code generated succesfully");
//   });
// });

function qrcodeGenerate(text) {
  QRCode.toFile(
    "filename.png",
    "Some text",
    {
      color: {
        dark: "#00F", // Blue dots
        light: "#0000" // Transparent background
      }
    },
    function(err) {
      if (err) throw err;
      console.log("done");
    }
  );
}

async function qrcodeReader(file) {
  // const img = await jimp.read(fs.readFileSync("out.png"));

  const img = await jimp.read(file);

  const qr = new QRReader();

  // qrcode-reader's API doesn't support promises, so wrap it
  const value = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => (err != null ? reject(err) : resolve(v));
    qr.decode(img.bitmap);
  });
  return value.result;
}

module.exports = {
  qrcodeReader,
  qrcodeGenerate
};
