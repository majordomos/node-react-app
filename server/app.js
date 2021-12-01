require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.NODE_PORT;
const path = require("path");
const routes = require("./router/routes");
mongoose.connect(process.env.MONGO_CONNECTION_STRING);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;
app.use('/', routes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
