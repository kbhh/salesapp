import express from "express";
import controller from "../../controllers/distribution/vehicleController";
import valSchema from "../../validators/Joi/distribution/vehicleSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/write",
  middleware(valSchema.vehcileSchema, "body"),
  auth("Write Vehicle", "Write Vehicle"),
  controller.write
);
router.put(
  "/modify/:id",
  middleware(valSchema.vehcileSchema, "body"),
  auth("Update Vehicle", "Update Vehicle"),
  controller.modify
);
router.put(
  "/changestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Update Vehicle Status", "Change Vehicle Status"),
  controller.changeStatus
);
router.get("/all", auth("", ""), controller.getAll);
router.get("/get/:id", auth("", ""), controller.getById);
router.get("/getbystatus", auth("", ""), controller.getByStatus);
router.get("/getverified", controller.getVerified);
router.get("/getlogs/:id", auth("", ""), controller.getLogs);
export default router;
