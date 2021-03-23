import express from "express";
import controller from "../../controllers/system/authorizationController";
import valSchema from "../../validators/Joi/system/aurhotizationSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
router.post(
  "/",
  middleware(valSchema.authorizationSchema, "body"),
  auth("Write Path", "Add Path"),
  controller.addPath
);
router.post(
  "/addroles/:id",
  middleware(valSchema.rolesSchema, "body"),
  auth("Write Path Roles", "Add Roles"),
  controller.addRoles
);
router.get("/single/:id", auth("", ""), controller.getById);
router.get("/all", auth("", ""), controller.getAll);
export default router;
