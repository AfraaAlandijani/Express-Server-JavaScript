import http from "http";
import fs from "fs/promises";
import { parse } from "querystring";

const PORT = "8080";

let products = [
  {
    id: "1",
    name: "Laptop",
    price: 4500,
    image: "https://m.media-amazon.com/images/I/81KoSSAwH2L._SL1500_.jpg",
    description: "High-performance laptop for all your needs.",
    categories: [1, 2],
    variants: ["8GB RAM", "16GB RAM"],
    sizes: ["13-inch", "15-inch"],
  },
  {
    id: "2",
    name: "Smartphone",
    price: 1500,
    image: "https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg",
    description: "Latest smartphone with advanced features.",
    categories: [1, 3],
    variants: ["64GB", "128GB"],
    sizes: [],
  },
];

const errorResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, { "content-type": "application/json" });
  res.end(
    JSON.stringify({
      message: message,
    })
  );
};

const successResponse = (res, statusCode, message, data = {}) => {
  res.writeHead(statusCode, { "content-type": "application/json" });
  res.end(
    JSON.stringify({
      message: message,
      data: data,
    })
  );
};

http
  .createServer((req, res) => {
    /* handle http requests */
    if (req.url == "/" && req.method == "GET") {
      try {
        successResponse(res, 200, "Hello World!");
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    } else if (req.url == "/products" && req.method == "GET") {
      try {
        successResponse(res, 200, "Return all products", products);
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "GET") {
      try {
        const id = req.url?.split("/")[2];
        const product = products.find((product) => product.id === id);
        if (!product) {
          errorResponse(res, 404, "product not found");
          return;
        }
        successResponse(res, 200, "Returned single product", product);
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    } else if (
      req.url.match(/\/products\/([0-9]+)/) &&
      req.method === "DELETE"
    ) {
      try {
        const id = req.url?.split("/")[2];
        const filteredProducts = products.filter(
          (product) => product.id !== id
        );
        if (filteredProducts) {
          successResponse(res, 200, "Product is deleted", filteredProducts);
        }
      } catch (error) {
        errorResponse(500, res, "server error");
      }
    } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "PUT") {
      try {
        const id = req.url?.split("/")[2];
        const product = products.find((product) => product.id === id);
        if (!product) {
          errorResponse(res, 404, "product not found");
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body = body + chunk;
          console.log("body", body);
        });
        req.on("end", () => {
          const updatedData = parse(body);
          if (String(updatedData.name)) {
            product.name = String(updatedData.name);
            successResponse(res, 200, "Product is updated");
          }
        });
      } catch (error) {
        errorResponse(500, res, "server error");
      }
    } else if (req.url == "/" && req.method == "POST") {
      try {
        let body = "";
        req.on("data", (data) => {
          body = body + data;
        });
        req.on("end", () => {
          console.log("Received POST data:", body);
          successResponse(res, 201, "Data received");
        });
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    } else if (req.url == "/products" && req.method == "POST") {
      try {
        let body = "";
        req.on("data", (chunk) => {
          body = body + chunk;
        });
        req.on("end", async () => {
          const data = parse(body);
          console.log(data);
          const newProduct = {
            id: new Date().getTime(),
            name: data.name,
            price: data.price,
            image: data.image,
            description: data.description,
            categories: data.categories,
            variants: data.variants,
            sizes: data.sizes,
          };
          const existingProducts = JSON.parse(
            await fs.readFile("products.json", "utf-8")
          );
          existingProducts.push(newProduct);
          await fs.writeFile("products.json", JSON.stringify(existingProducts));
          successResponse(res, 201, "New product is created");
        });
      } catch (error) {
        errorResponse(res, 500, error.message);
      }
    }
  })
  .listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
  });
