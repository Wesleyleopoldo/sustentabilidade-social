const express = require("express");
const router = require("./router");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerConfig");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(router);
app.use(errorHandler);

module.exports = app;