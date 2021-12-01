
require('dotenv').config();
const breedModel = require("../model/breedModel");
const dogModel = require("../model/dogModel");
const axios = require("axios");
const express = require('express');
const router = express.Router();
router.get("/breeds", async (req, res) => {
    const getBreeds = async () => {
      try {
        return await axios.get(process.env.AXIOS_STRING);
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
  
  router.get("/dogs", async (req, res) => {
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
module.exports = router;