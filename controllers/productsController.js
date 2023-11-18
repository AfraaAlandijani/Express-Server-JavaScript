import fs from "fs/promises";

let products = [
  {
    id: 1,
    name: "Laptop",
    image: "https://m.media-amazon.com/images/I/81KoSSAwH2L._SL1500_.jpg",
    description: "High-performance laptop for all your needs.",
    categories: [1, 2],
    variants: ["8GB RAM", "16GB RAM"],
    sizes: ["13-inch", "15-inch"],
    price: 1500,
  },
  {
    id: 2,
    name: "Smartphone",
    image: "https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg",
    description: "Latest smartphone with advanced features.",
    categories: [1, 3],
    variants: ["64GB", "128GB"],
    sizes: [],
    price: 700,
  },
];

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).send({
    success: false,
    message: message,
  });
};
const successResponse = (res, statusCode, message, payload) => {
  res.status(statusCode).send({
    success: true,
    message: message,
    payload: payload,
  });
};

export const getAllProducts = (req, res) => {
  try {
    successResponse(res, 200, "Return all products", products);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getSingleProducts = (req, res) => {
  try {
    const id = req.params.id;
    const product = products.find((product) => product.id == id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: `Product not found with the id ${id}`,
      });
      return;
    }
    successResponse(
      res,
      200,
      `Single Product is returned with the id ${id}`,
      product
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteProducts = (req, res) => {
  try {
    const id = req.params.id;
    const product = products.find((product) => String(product.id) == id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
      return;
    }
    const filteredProducts = products.filter((product) => String(product.id) !== id);
    products = filteredProducts;
    successResponse(
      res,
      200,
      `Single Product is deleted with the id ${id}`,
      products
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const addProducts = async (req, res) => {
  try {
    const { name, price, image, description, categories, sizes, variants } =
      req.body;
    const newProduct = {
      id: new Date().getTime(),
      name: name,
      price: price,
      image: image,
      description: description,
      categories: categories,
      variants: variants,
      sizes: sizes,
    };
    const existingProducts = JSON.parse(
      await fs.readFile("products.json", "utf-8")
    );
    existingProducts.push(newProduct);
    await fs.writeFile("products.json", JSON.stringify(existingProducts));
    successResponse(res, 201, "New Products is added", newProduct);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateProducts = (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, image, description, categories, sizes, variants } =
      req.body;
    const productIndex = products.findIndex((product) => product.id == id);
    if (productIndex == -1) {
      errorResponse(res, 500, `Product not found with the id ${id}`);

      return;
    }

    products[productIndex].name = name ?? products[productIndex].name;
    products[productIndex].price = price ?? products[productIndex].price;
    products[productIndex].image = image ?? products[productIndex].image;
    products[productIndex].description =
      description ?? products[productIndex].description;
    products[productIndex].categories =
      categories ?? products[productIndex].categories;
    products[productIndex].variants =
      variants ?? products[productIndex].variants;
    products[productIndex].sizes = sizes ?? products[productIndex].sizes;

    successResponse(
      res,
      200,
      `Single Product is updated with the id ${id}`,
      products[productIndex]
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
