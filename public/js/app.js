const canvas = document.getElementById("canvas");
const text = document.getElementById("text");
const error = document.getElementById("error");
const submit = document.getElementById("submit");
const context = canvas.getContext("2d");
const save = document.getElementById("save");
const qrcodeSubmit = document.getElementById("qrcodeSubmit");
const qrcodeValue = document.getElementById("qrcodeValue");
const qrcodeImage = document.getElementById("qrcodeImage");

submit.addEventListener("click", e => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  error.innerHTML = "";
  if (text.value) {
    return QRCode.toCanvas(
      canvas,
      text.value,
      {
        // color: {
        //   dark: "#00F", // Blue dots
        //   light: "#0000" // Transparent background,
        // },
        width: 360
      },
      function(error) {
        if (error) error.innerHTML = "Please Enter text";
        save.style.display = "block";
      }
    );
  }
  error.innerHTML = "Please Enter text";
});

save.addEventListener("click", e => {
  const image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
  save.setAttribute("download", "qrcode.png");
  save.href = image;
  // window.location.href = image; // it will save locally
});

qrcodeSubmit.addEventListener("click", e => {
  const file = qrcodeImage.files[0];
  const formData = new FormData();
  formData.append("file", file);
  qrcodeValue.style.display = "block";
  qrcodeValue.innerHTML = "";
  qrcodeValue.classList.remove("error");
  if (file) {
    fetch("/qrcode/reader", {
      method: "POST",
      // headers: {'Content-Type':'multipart/form-data'},
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          qrcodeValue.innerHTML = "Your QR Code : " + data.value;
        }
      })
      .catch(err => {
        qrcodeValue.classList.add("error");
        qrcodeValue.innerHTML = "Please select an qrcode image";
      });
  } else {
    qrcodeValue.classList.add("error");
    qrcodeValue.innerHTML = "Please select an qrcode image";
  }
});
