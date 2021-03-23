import express from "express";
import controller from "../../controllers/system/accountManagemntController";
import valSchema from "../../validators/Joi/system/accountManagementSchema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";

const router = express.Router();
const roles = ["Sales Officer", "DGM", "GM", "Admin", "Customer"];
router.post(
  "/",
  middleware(valSchema.roleSchema, "body"),
  auth("Write Role Management", "Write Account roles"),
  controller.addRole
);
router.post(
  "/createdby/:id",
  middleware(valSchema.canbeCreatedBySchema, "body"),
  auth("Write Account Created By", "Created By"),
  controller.canbeCeatedby
);
router.post(
  "/verifiedBy/:id",
  middleware(valSchema.canbeVerifiedBySchema, "body"),
  auth("Write Account Verified By", "Verified By"),
  controller.canbeVerifiedby
);
router.put(
  "/update/:id",
  middleware(valSchema.roleSchema, "body"),
  auth("Update Role Management", "Update Role Management"),
  controller.update
);
// router.put(
//   "/changestatus/:id",
//   middleware(valSchema.VerifySchema, "body"),
//   auth("DGM", "Change Status"),
//   controller.update
// );
// router.get("/single/:id", auth("", "", true), controller.getById);
// router.get("/all", auth("", "", true), controller.getAll);
// router.get("/verified", auth("", "", true), controller.getVerified);
// router.get("/log/:id", auth("", "", true), controller.getLogs);
export default router;
