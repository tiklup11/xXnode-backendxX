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
let count = 0;

// Define an array of URLs
const urls = [
  "https://assets-news.housing.com/news/wp-content/uploads/2022/03/16195548/21-small-bathroom-tiles-design.jpg",
  "https://5.imimg.com/data5/JW/MV/MY-8533797/glazed-floor-tiles.jpg",
  "https://www.hrjohnsonindia.com/assets/images/blog/armilo-silver-thumb-og.jpg",
  // (tiles = [
  //   "https://assets-news.housing.com/news/wp-content/uploads/2022/03/16195548/21-small-bathroom-tiles-design.jpg",
  //   "https://5.imimg.com/data5/JW/MV/MY-8533797/glazed-floor-tiles.jpg",
  //   "https://www.hrjohnsonindia.com/assets/images/blog/armilo-silver-thumb-og.jpg",
  // ]),
  // (fans = [
  //   "https://www.realsimple.com/thmb/PiBiYsb9YgZ3ZBY4cU9-fT4Iki8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/real-simple-fan-test-lead-67d01b3d1d704411b07219fe6d192b3e.jpg",
  //   "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FKhaitar-Super-Delux-Fans%2Fdp%2FB082M9VFTL&psig=AOvVaw3aFeI0bd1amB8P1dEh8VyZ&ust=1697351426130000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLjm1vj09IEDFQAAAAAdAAAAABAJ",
  //   "https://great-white.in/images/Brown-Copter-32-Pro.jpg",
  // ]),
  // (light_bulb = [
  //   "https://images-na.ssl-images-amazon.com/images/I/41M86kpn1NL._SL500_._AC_SL500_.jpg",
  //   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuN03HmBtiocWCv0H6JjHh4sdEg0am5DqNWs3r29UsICtvfPjkop-vxvco3ojizbtuDB4&usqp=CAU",
  //   "https://www.ikea.com/global/assets/range-categorisation/images/decorative-pendant-lamps-700177.jpeg?imwidth=500",
  // ]),
];

// Create a GET endpoint that responds with the array of URLs
app.get("/test", (req, res) => {
  // if (c % 3 == 0) res.json({ data: urls[tiles] });
  // else if (c % 3 == 1) res.json({ data: urls[fans] });
  // else if (c % 3 == 2) res.json({ data: urls[light_bulb] });
  // c++;
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
