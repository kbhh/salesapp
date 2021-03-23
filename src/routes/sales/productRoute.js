import express from "express";
import controller from "../../controllers/sales/productController";
import valSchema from "../../validators/Joi/sales/productSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/",
  middleware(valSchema.branchSchema, "body"),
  auth("Write Product", "Product Registration"),
  controller.add
);
router.put(
  "/update/:id",
  middleware(valSchema.branchSchema, "body"),
  auth("Update Product", "Product Update"),
  controller.modify
);
router.put(
  "/changestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Verify Product", "Change Status"),
  controller.update
);
router.post(
  "/setprice/:id",
  middleware(valSchema.priceSchema, "body"),
  auth("Write Product Price", "Set Product Price"),
  controller.setPrice
);
router.put(
  "/modifyprice/:id",
  middleware(valSchema.priceSchema, "body"),
  auth("Update Product Price", "Update Product Price"),
  controller.modifyPrice
);
router.put(
  "/pricestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Verify Product Price", "Verify Price"),
  controller.verifyPrice
);
router.put(
  "/image/:id",
  controller.uploadImg,
  auth("Write Product Image", "Insert Product Image"),
  controller.updateImg
);
router.get("/single/:id", auth("", "", true), controller.getSingle);
router.get("/pricecalculator/:id", controller.getPriceCalculator);
router.get("/log/:id", auth("", "", true), controller.getProductLogs);
router.get("/pricelog/:id", auth("", "", true), controller.getPriceLogs);
router.get("/all", auth("", "", true), controller.getAll);
router.get("/verified", controller.getVerified);
export default router;
