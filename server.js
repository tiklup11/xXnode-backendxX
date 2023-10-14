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

// Define an array of URLs
const urls = [
  "https://assets-news.housing.com/news/wp-content/uploads/2022/03/16195548/21-small-bathroom-tiles-design.jpg",
  "https://5.imimg.com/data5/JW/MV/MY-8533797/glazed-floor-tiles.jpg",
  "https://www.hrjohnsonindia.com/assets/images/blog/armilo-silver-thumb-og.jpg",
];

// Create a GET endpoint that responds with the array of URLs
app.get("/test", (req, res) => {
  res.json({ data: urls });
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
      "https://ml-model-service.onrender.com/predict",
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
