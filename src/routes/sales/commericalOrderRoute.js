import express from "express";
import controller from "../../controllers/sales/commericalOrdersController";
import productController from "../../controllers/sales/productController";
import freightController from "../../controllers/distribution/freightPriceController";
import valSchema from "../../validators/Joi/sales/commericalOrderSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/",
  middleware(valSchema.orderSchema, "body"),
  productController.getPriceMiddleware,
  auth("Write Commerical Order", "Write Commerical Order"),
  controller.addOrder
);
router.post(
  "/orderbyemployee",
  middleware(valSchema.salesofficerorderSchema, "body"),
  productController.getPriceMiddleware,
  auth("Write Sales Officer Commerical Order", "Write Commerical Order"),
  controller.addOrder
);
router.put(
  "/update/:id",
  middleware(valSchema.orderSchema, "body"),
  auth("Update Commerical Order", "Update Commerical Order"),
  productController.getPriceMiddleware,
  controller.modifyOrder
);
router.put(
  "/updateorderbyemployee/:id",
  middleware(valSchema.salesofficerorderSchema, "body"),
  auth("Update Commerical Order by Employees", "Update Commerical Order"),
  productController.getPriceMiddleware,
  controller.modifyOrder
);
router.put(
  "/verifyorder/:id",
  middleware(valSchema.VerifyOrderSchema, "body"),
  auth("Update Commerical Order Status", "Update Commerical Order Status"),
  controller.verifyOrder
);
router.put(
  "/addbatch/:id",
  middleware(valSchema.orderBatchSchema, "body"),
  auth("Write Commerical Order Batch", "Write Commerical Order Batch"),
  controller.getOrderMiddleware,
  productController.getBatchPriceMiddleware,
  freightController.getPriceMiddleware,
  controller.addBatch
);
router.put(
  "/cancelbatch/:id",
  middleware(valSchema.cancleBatchSchema, "body"),
  auth("Update Cancel Commerical Order Batch", "Cancel Batch Order"),
  controller.cancelBatch
);
router.put(
  "/verifybatch/:id",
  middleware(valSchema.VerifyBatchSchema, "body"),
  auth("Update Commerical Order Batch Status", "Verify commerical Order batch"),
  controller.verifyBatch
);
router.put(
  "/batchpayment/:id",
  middleware(valSchema.paymentSchema, "body"),
  auth(
    "Update Commerical Batch Payment",
    "Request for Payment Verification of a batch"
  ),
  controller.batchPayment
);
router.put(
  "/orderpayment/:id",
  middleware(valSchema.orderPaymentSchema, "body"),
  auth(
    "Update Commerical Order Payment",
    "Request for Payment Verification of an order"
  ),
  controller.orderPayment
);
router.put(
  "/verifybatchpayment/:id",
  middleware(valSchema.VerifyBatchSchema, "body"),
  auth("Verify Commerical Batch Payment", "Request for Payment Verification"),
  controller.verifyBatchPayment
);
router.get(
  "/batch/:id",
  middleware(valSchema.batchIdSchema, "body"),
  auth("", ""),
  controller.getBatch
);

router.get("/order/:id", auth("", ""), controller.getOrder);
router.get("/myorders", auth("", ""), controller.getMyOrders);
router.get("/ordersbystatus", auth("", ""), controller.getOrdersByStatus);

export default router;
