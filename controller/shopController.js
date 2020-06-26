import { Shop } from "./../model/shopModel";

import {
  createDocument,
  readAllDocument,
  readDocumentById,
  updateDocumentByID,
  deleteDocumentByID,
} from "./../handlers/factoryHandler";

// Middleware

import { processDataWithMultipleImage } from "./../middleware/imageProcessing";

export const processProductData = processDataWithMultipleImage(
  "productImages",
  "mysqlproducts",
  3
);
export const addProduct = createDocument(Shop, {
  message: "New Product added Successfully",
});

export const getAllProducts = readAllDocument(Shop, {
  message: "List of Car Parts",
});

export const getProduct = readDocumentById(Shop, {
  message: "Requested Product",
});

export const updateProduct = updateDocumentByID(Shop, {
  message: "Product Updated Successfully",
});

export const deleteProduct = deleteDocumentByID(Shop, {
  message: "Product Deleted Successfully",
});
