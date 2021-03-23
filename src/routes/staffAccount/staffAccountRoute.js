import express from "express";
import accountController from "../../controllers/staffAccount/accountController";
import profileSchema from "../../validators/Joi/users/signup_schema";
import middleware from "../../middlewares/validationMiddleware";
import auth from "../../middlewares/auths";
import accountManagementController from "../../controllers/system/accountManagemntController";

const router = express.Router();
const roles = [
  "GM",
  "DGM",
  "DPM",
  "Sys Admin",
  "DVM",
  "Sales Officer",
  "Dispatch Officer",
  "Bridge Officer",
];
const depRegisterRoles = ["DVM", "DPM"];
router.post(
  "/signup",
  middleware(profileSchema.adminSignUpSchema, "body"),
  auth("Write Staff Signup", "Account Registration"),
  accountController.addProfileMiddleware,
  accountManagementController.accountMiddleware,
  accountController.signup
);
router.post(
  "/changerole/:id",
  middleware(profileSchema.changeRoleSchema, "body"),
  auth("Update Staff Role", "Change Staff Role"),
  accountController.changeRoleMiddleware,
  accountManagementController.changeRoleMiddleware,
  accountController.changeRole
);
router.post(
  "/changestatus/:id",
  middleware(profileSchema.changeStatusSchema, "body"),
  auth("Verify Staff Account", "Verify or Suspend Staff Account"),
  accountController.getRoleMiddleware,
  accountManagementController.verifyMiddleware,
  accountController.changeRole
);
router.post(
  "/manualpasswordreset/:id",
  middleware(profileSchema.manualPasswordResetSchema, "body"),
  auth("Update Password Reset", "Password Reset"),
  accountController.getRoleMiddleware,
  accountManagementController.verifyMiddleware,
  accountController.manualpasswordReset
);
router.post(
  "/login",
  middleware(profileSchema.LoginSchema, "body"),
  accountController.login
);
router.put(
  "/profile",
  middleware(profileSchema.updateSchema, "body"),
  auth("", "Update Profile"),
  accountController.updateProfile
);
router.put(
  "/profileimage",
  accountController.uploadProfileImg,
  auth("", "Insert Profile Image"),
  accountController.updateProfileImg
);
router.get("/me", auth(""), accountController.getme);
router.get(
  "/branch",
  auth("Get All Employees", "Get All Employees"),
  accountController.getAll
);

export default router;
