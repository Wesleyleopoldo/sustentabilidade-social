const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const express = require("express");
const router = require("./router");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const swaggerDocument = YAML.parse(fs.readFileSync("./src/docs/swagger.yaml", "utf8"));

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: "http://127.0.0.1:5500", // ou "http://localhost:5500" dependendo de onde está seu frontend
  credentials: true, // permite cookies
}));

app.use(router);
app.use(errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;