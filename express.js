import express from "express";
import morgan from "morgan";

import "dotenv/config";

import productsRoutes from "./routes/productsRoute.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(productsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.status(201).send({
    success: true,
    message: "Data is received",
    paylod: req.body,
  });
});

app.listen(port, () => {
  console.log("Our server is running");
});
