import express from "express";
import controller from "../../controllers/admin/branchController";
import valSchema from "../../validators/Joi/admin/branchSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/",
  middleware(valSchema.branchSchema, "body"),
  auth("Write Branch", "Branch Registration"),
  controller.create
);
router.put(
  "/update/:id",
  middleware(valSchema.branchSchema, "body"),
  auth("Update Branch", "Branch Update"),
  controller.update
);
router.put(
  "/changestatus/:id",
  middleware(valSchema.VerifySchema, "body"),
  auth("Verify Branch", "Verify or Suspend Branch"),
  controller.update
);
router.get("/single/:id", auth("", ""), controller.getById);
router.get("/all", auth("", ""), controller.getAll);
router.get("/verified", auth("", ""), controller.getVerified);
router.get("/log/:id", auth("", ""), controller.getLogs);
export default router;
