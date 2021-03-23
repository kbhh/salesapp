import express from "express";
import controller from "../../controllers/inventory/storeController";
import valSchema from "../../validators/Joi/inventory/storeSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/",
  middleware(valSchema.storeSchema, "body"),
  auth("Write Store", "Store Registration"),
  controller.registerStore
);
router.put(
  "/update/:id",
  middleware(valSchema.storeSchema, "body"),
  auth("Update Store", "Store Update"),
  controller.update
);
router.put(
  "/changestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Verify Store", "Verify or Suspend Branch"),
  controller.update
);
router.put(
  "/addproduct/:id",
  middleware(valSchema.productSchema, "body"),
  auth("Write Product Store", "Add Product and its package to store"),
  controller.addProduct
);
router.put(
  "/updateproduct/:id",
  middleware(valSchema.productSchema, "body"),
  auth("Update Product Store", "Update Product and its package to store"),
  controller.modifyProduct
);
router.put(
  "/depositproduct/:id",
  middleware(valSchema.depositSchema, "body"),
  auth("Write Product Deposit", "Deposit Product to store"),
  controller.depositProduct
);
router.put(
  "/deductdepositproduct/:id",
  middleware(valSchema.depositSchema, "body"),
  auth("Update Product Deposit", "Deduct Product to store"),
  controller.deductDepoistProduct
);
router.get("/single/:id", auth("", ""), controller.getById);
router.get("/all", auth("", ""), controller.getAll);
router.get("/verified", auth("", ""), controller.getVerified);
router.get("/log/:id", auth("", ""), controller.getLogs);
export default router;
