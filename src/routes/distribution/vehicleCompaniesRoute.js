import express from "express";
import controller from "../../controllers/distribution/vehicleCompaniesController";
import valSchema from "../../validators/Joi/distribution/vehicleCompaniesSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/write",
  middleware(valSchema.vehcilecompaniesSchema, "body"),
  auth("Write Vehicle Companies", "Write Vehicle Companies"),
  controller.write
);
router.put(
  "/modify/:id",
  middleware(valSchema.vehcilecompaniesSchema, "body"),
  auth("Update Vehicle Companies", "Update Vehicle Companies"),
  controller.modify
);
router.put(
  "/writeagreement/:id",
  middleware(valSchema.agreementSchema, "body"),
  auth(
    "Write Vehicle Companies Agreement",
    "Write Vehicle Companies Agreement"
  ),
  controller.writeAgreement
);
router.put(
  "/changestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Update Vehicle Companies Status", "Change Vehicle Companies Status"),
  controller.changeStatus
);
router.put(
  "/changeagreementstatus/:id",
  middleware(valSchema.VerifyAgreementSchema, "body"),
  auth(
    "Update Vehicle Company Agreement Status",
    "Update Vehicle Company Agreement Status"
  ),
  controller.changeAgreementStatus
);
router.put(
  "/writecity/:id",
  middleware(valSchema.citySchema, "body"),
  auth("Write Vehicle Companies City", "Write Vehicle Companies City"),
  controller.writeCity
);
router.put(
  "/changecitystatus/:id",
  middleware(valSchema.cityStatusSchema, "body"),
  auth(
    "Update Vehicle Company Assigned City Status",
    "Update Vehicle Company Assigned City Status"
  ),
  controller.changeCityStatus
);
router.get("/all", auth("", ""), controller.getAll);
router.get("/get/:id", auth("", ""), controller.getById);
router.get("/getbystatus", auth("", ""), controller.getByStatus);
router.get("/getlogs/:id", auth("", ""), controller.getLogs);
export default router;
