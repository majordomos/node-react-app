const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const breedModel = require("./model/breedModel");
const dogModel = require("./model/dogModel");
const axios = require("axios");

mongoose.connect("mongodb://127.0.0.1/react-node-app");
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

app.get("/breeds", async (req, res) => {
  const getBreeds = async () => {
    try {
      return await axios.get("https://dog.ceo/api/breeds/image/random/50");
    } catch (error) {
      console.error(error);
    }
  };

  const countBreeds = async () => {
    const firstRequest = await getBreeds();
    const secondRequest = await getBreeds();
    const breeds = [
      ...firstRequest.data.message,
      ...secondRequest.data.message,
    ];
    breeds.forEach((str) => {
      const splittedString = str.split("/");
      const newBreed = new breedModel({ title: splittedString[4] });
      newBreed.save(function () {
        const newDog = new dogModel({
          breed: newBreed._id,
          image: str,
          title: splittedString[5].split(".")[0],
        });
        newDog.save();
      });
    });
  };
  countBreeds();
  res.status(200).send("OK");
});

app.get("/dogs", async (req, res) => {
  const random = Math.floor(Math.random());
  const result = await dogModel
    .find()
    .skip(random)
    .lean()
    .populate("breed");
  const dogsJson = result.map((item) => ({
    breed: item.breed.title,
    image: item.image,
    title: item.title,
  }));
  res.status(200).json({ dogs: dogsJson });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
