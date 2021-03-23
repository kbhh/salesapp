import express from "express";
import profileController from "../../controllers/customer/customerController";
import profileSchema from "../../validators/Joi/customers/registration_schema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auth";

const router = express.Router();
const roles = ["Sales Officer", "Manager", "Admin", "Customer"];
router.post(
  "/",
  middleware(profileSchema.registrationSchema, "body"),
  auth("Sales Officer", "Registration"),
  profileController.register
);
router.post(
  "/address/:id",
  middleware(profileSchema.addressSchema, "body"),
  auth("Sales Officer", "Address Registration"),
  profileController.registerAddress
);
router.put(
  "/address/:id",
  middleware(profileSchema.addressSchema, "body"),
  auth("Sales Officer", "Address Update"),
  profileController.updateAddress
);
router.post(
  "/paymentmethod/:id",
  middleware(profileSchema.paymentMethodSchema, "body"),
  auth("Sales Officer", "Request Payment Method Change"),
  profileController.requestPaymentMethodChange
);
router.put(
  "/paymentmethod/:id",
  middleware(profileSchema.VerifySchema, "body"),
  auth("DVM", "Verify Payment Method Change"),
  profileController.verifyPaymentMethodChange
);
router.post(
  "/priority/:id",
  middleware(profileSchema.prioritySchema, "body"),
  auth("Sales Officer", "Request Priority Change"),
  profileController.requestPriorityChange
);
router.put(
  "/priority/:id",
  middleware(profileSchema.VerifySchema, "body"),
  auth("DVM", "Verify Priority Method Change"),
  profileController.verifyPriorityChange
);
router.post(
  "/account/:id",
  middleware(profileSchema.accountSchema, "body"),
  auth("Sales Officer", "Create Account"),
  profileController.accountCreate
);
router.post(
  "/login/",
  middleware(profileSchema.LoginSchema, "body"),
  profileController.login
);
router.put(
  "/profileimage",
  auth("Customer"),
  profileController.uploadProfileImg,
  profileController.updateProfileImg
);
router.put(
  "/changestatus/:id",
  middleware(profileSchema.VerifySchema, "body"),
  auth("Sales Officer", "Change Status"),
  profileController.changeStatus
);

router.put(
  "/:id",
  middleware(profileSchema.updateregistrationSchema, "body"),
  auth("Sales Officer", "Update Registration"),
  profileController.updateRegistation
);
router.get("/me", auth("Customer"), profileController.getme);
router.get("/single/:id", profileController.getById);
router.get("/all", profileController.getAllCustomers);
router.get("/bystatus", profileController.getByStatus);
router.get("/log/:id", profileController.getLogs);
export default router;
