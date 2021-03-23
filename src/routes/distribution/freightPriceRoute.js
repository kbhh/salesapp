import express from "express";
import controller from "../../controllers/distribution/freightPriceController";
import valSchema from "../../validators/Joi/distribution/freightPriceSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/city",
  middleware(valSchema.citySchema, "body"),
  auth("Write Freight City", "Write Freight City"),
  controller.addCity
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
  auth("Update Freight Store Status", "Change Freight Store Status"),
  controller.update
);
router.put(
  "/verifycity/:id",
  middleware(valSchema.VerifyCitySchema, "body"),
  auth("Update Freight City Status", "Verify or Suspend Freight City"),
  controller.verifyCity
);
router.post(
  "/setprice/:id",
  middleware(valSchema.priceSchema, "body"),
  auth("Write Freight Price", "Set Freight Price"),
  controller.setPrice
);
router.put(
  "/pricestatus/:id",
  middleware(valSchema.VerifyPriceSchema, "body"),
  auth("Update Freight Price Status", "Verify Price"),
  controller.verifyPrice
);
router.get("/allfreight", auth("", ""), controller.getAllFreight);
router.get("/freight/:id", auth("", ""), controller.getFreight);
router.get("/price/:id", auth("", ""), controller.getPrice);
router.get("/verifiedprices/:id", controller.getVerifiedPrices);
router.get("/all", auth("", "", true), controller.getAll);
router.get("/pricemiddleware", auth("", ""), controller.getPriceMiddleware);
router.get("/pricebypackage", controller.getFreightByPackage);
export default router;
