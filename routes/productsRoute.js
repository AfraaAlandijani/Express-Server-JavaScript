import { Router } from "express";
import {
  addProducts,
  deleteProducts,
  getAllProducts,
  getSingleProducts,
  updateProducts,
} from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.get("/products", getAllProducts);
productsRouter.get("/products/:id", getSingleProducts);
productsRouter.post("/products", addProducts);
productsRouter.delete("/products/:id", deleteProducts);
productsRouter.put("/products/:id", updateProducts);

export default productsRouter;
