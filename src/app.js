const express = require("express");
const router = require("./router");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(cors())

app.use(router);
app.use(errorHandler);

module.exports = app;