const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const FormData = require("form-data");

const multer = require("multer");
const spawn = require("child_process").spawn;
app.use(bodyParser.urlencoded({ extended: true }));

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.send("Welcome to crazy nerds");
});

app.post("/upload_image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image not provided." });
  }

  const imageBuffer = req.file.buffer;

  try {
    const formData = new FormData();
    formData.append("image", Buffer.from(imageBuffer), {
      filename: "image.jpg",
    });

    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // console.log("Response from Python server:", response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error.message);
  }

  res.status(200).json({ message: "Image uploaded successfully." });
});

let port = process.env.PORT;
if (port == "" || port == null) {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server Running Up on Port ", port);
});
