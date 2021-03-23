import express from "express";
import controller from "../../controllers/distribution/carriageController";
import valSchema from "../../validators/Joi/distribution/carriageSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/write",
  middleware(valSchema.carriageTypeSchema, "body"),
  auth("Write Carriage Type", "Write Carriage Type"),
  controller.write
);
router.put(
  "/modify/:id",
  middleware(valSchema.carriageTypeSchema, "body"),
  auth("Update Carriage Type", "Update Carriage Type"),
  controller.modify
);
router.put(
  "/writeCarriage/:id",
  middleware(valSchema.carriageSchema, "body"),
  auth("Write Vehicle Carriage", "Write Vehicle Carriage"),
  controller.writeCarriage
);
router.put(
  "/changestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Update Carriage Status", "Update Carriage Status"),
  controller.changeStatus
);
router.put(
  "/changecarriagestatus/:id",
  middleware(valSchema.VerifyCarriageSchema, "body"),
  auth("Update Carriage Amount Status", "Change Carriage Amount Status"),
  controller.changeCarriageStatus
);
router.get("/all", auth("", ""), controller.getAll);
router.get("/get/:id", auth("", ""), controller.getById);
router.get("/getbystatus", auth("", ""), controller.getByStatus);
router.get("/getverified", controller.getVerified);
router.get("/getlogs/:id", auth("", ""), controller.getLogs);
export default router;
