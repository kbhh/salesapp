import CrudService from "../../lib/crud";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
import { imageValidator } from "../../validators/Joi/fileValidator";
import multer from "multer";
class UserService extends CrudService {
  constructor(model) {
    super(model);
  }
  async adminRegister(req) {
    try {
      let message = "";
      let body = req.body;
      let { mobileNumber, employeeId, username, role } = body;
      let phoneExist = await this.getByField({ mobileNumber: mobileNumber });
      if (!phoneExist.error) {
        message = "Phone number,";
      }
      let userExist = await this.getByField({ employeeId: employeeId });
      if (!userExist.error) {
        message = message + " Employee ID, ";
      }
      let usernameExist = await this.getByField({ username: username });
      if (!usernameExist.error) {
        message = message + " username, ";
      }
      let email = body.email;
      let emailExists = await this.getByField({ email: email });
      if (!emailExists.error) {
        if (message === "") {
          message = " Email is ";
        } else {
          message = message + " and Email are ";
        }
      }
      if (message !== "") {
        message =
          message + " already taken please login or reset your account ";
        return {
          error: true,
          message: message,
          statusCode: 200,
          record: null,
        };
      } else {
        if (["GM", "DGM", "Sys Admin", "DPM"].includes(role)) {
          if (role == "DPM") {
            body.status = "Unverified";
          }
          body.password = await bcrypt.hashSync(body.password, 8);
          body.log = { actor: req.log.actor, activity: req.log.activity };
          let record = await this.create(body);
          return record;
        } else {
          return {
            error: true,
            message: "You are not authroized to create account for " + role,
            statusCode: 400,
            record: null,
          };
        }
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async signup(req) {
    if (["GM", "DPM", "Sys Admin"].includes(req.body.role)) {
      return {
        error: true,
        message: "You are not authorized to create account for this role",
        statusCode: 200,
        record: null,
      };
    } else {
      try {
        let message = "";
        let body = req.body;
        let { mobileNumber, employeeId, username, role } = body;
        let phoneExist = await this.getByField({ mobileNumber: mobileNumber });
        if (!phoneExist.error) {
          message = "Phone number,";
        }
        let userExist = await this.getByField({ employeeId: employeeId });
        if (!userExist.error) {
          message = message + " Employee ID, ";
        }
        let usernameExist = await this.getByField({ username: username });
        if (!usernameExist.error) {
          message = message + " username, ";
        }
        let email = body.email;
        let emailExists = await this.getByField({ email: email });
        if (!emailExists.error) {
          if (message === "") {
            message = " Email is ";
          } else {
            message = message + " and Email are ";
          }
        }
        if (message !== "") {
          message =
            message + " already taken, please login or reset your account ";
          return {
            error: true,
            message: message,
            statusCode: 200,
            record: null,
          };
        } else {
          if (role == "DVM") {
            if (req.role == "DPM") {
              let officeChecking = await this.getById(req.id);
              body.department = officeChecking.record.department;
              body.office = officeChecking.record.office;
              body.division = officeChecking.record.division;
              body.password = await bcrypt.hashSync(body.password, 8);
              body.log = { actor: req.log.actor, activity: req.log.activity };
              let record = await this.create(body);
              return record;
            } else {
              return {
                error: true,
                message:
                  "You are not authroized to create account for  " + role,
                statusCode: 400,
                record: null,
              };
            }
          } else if (req.role == "DVM") {
            let officeChecking = await this.getById(req.id);
            body.department = officeChecking.record.department;
            body.office = officeChecking.record.office;
            body.division = officeChecking.record.division;
            body.password = await bcrypt.hashSync(body.password, 8);
            body.log = { actor: req.log.actor, activity: req.log.activity };
            let record = await this.create(body);
            return record;
          } else {
            return {
              error: true,
              message: "You are not authroized to create account " + role,
              statusCode: 400,
              record: null,
            };
          }
        }
      } catch (errormessage) {
        return {
          error: true,
          message: errormessage,
          statusCode: 400,
          record: null,
        };
      }
    }
  }
  async changeRole(req) {
    try {
      let role = req.body.role;
      let id = req.params.id;
      if (req.role == "Sys Admin") {
        if (["GM", "DGM"].includes(role)) {
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        } else {
          return {
            error: true,
            message: "You are not authroized to change role for  " + role,
            statusCode: 400,
            record: null,
          };
        }
      } else if (
        ((req.role == "DPM" || req.role == "DVM") &&
          ["GM", "DGM", "Sys Admin"].includes(role)) ||
        (req.role == "DVM" && role == "DPM")
      ) {
        return {
          error: true,
          message: "You are not authroized to change role for  " + role,
          statusCode: 400,
          record: null,
        };
      } else {
        let modifierOfficer = await this.getById(req.id);
        let tobemodifiedOfficer = await this.getById(id);
        if (
          modifierOfficer.record.division ==
            tobemodifiedOfficer.record.division &&
          modifierOfficer.record.office == tobemodifiedOfficer.record.office
        ) {
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        } else {
          return {
            error: true,
            message:
              "You are not authroized to change role for officer that is not in the same office and division  ",
            statusCode: 400,
            record: null,
          };
        }
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async changeStatus(req) {
    try {
      let id = req.params.id;
      let tobesuspended = await this.getById(id);
      let modifierOfficer = await this.getById(req.id);
      let role = tobesuspended.record.role;
      if (req.role == "GM" || (req.role == "DGM" && role !== "GM")) {
        let record = await this.update(id, req.body);
        await this.updateByAddSet(id, {
          log: { actor: req.log.actor, activity: req.log.activity },
        });
        return record;
      } else if (!["GM", "DGM", "Sys Admin"].includes(role)) {
        if (
          req.role == "DPM" &&
          modifierOfficer.record.division == tobesuspended.record.division &&
          modifierOfficer.record.office == tobesuspended.record.office
        ) {
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        } else if (
          !["DPM"].includes(role) &&
          req.role == "DVM" &&
          modifierOfficer.record.division == tobesuspended.record.division &&
          modifierOfficer.record.office == tobesuspended.record.office
        ) {
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        } else {
          return {
            error: true,
            message:
              "You are not authroized to change account status for " + role,
            statusCode: 400,
            record: null,
          };
        }
      } else {
        return {
          error: true,
          message:
            "You are not authroized to change account status for " + role,
          statusCode: 400,
          record: null,
        };
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async manualpasswordReset(req) {
    try {
      let id = req.params.id;
      let tobesuspended = await this.getById(id);
      let modifierOfficer = await this.getById(req.id);
      let role = tobesuspended.record.role;
      if (req.role == "GM" || (req.role == "DGM" && role !== "GM")) {
        req.body.password = await bcrypt.hashSync(req.body.password, 8);
        let record = await this.update(id, req.body);
        await this.updateByAddSet(id, {
          log: { actor: req.log.actor, activity: req.log.activity },
        });
        return record;
      } else if (!["GM", "DGM", "Sys Admin"].includes(role)) {
        if (
          req.role == "DPM" &&
          modifierOfficer.record.division == tobesuspended.record.division &&
          modifierOfficer.record.office == tobesuspended.record.office
        ) {
          req.body.password = await bcrypt.hashSync(req.body.password, 8);
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        } else if (
          !["DPM"].includes(role) &&
          req.role == "DVM" &&
          modifierOfficer.record.division == tobesuspended.record.division &&
          modifierOfficer.record.office == tobesuspended.record.office
        ) {
          req.body.password = await bcrypt.hashSync(req.body.password, 8);
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        } else {
          return {
            error: true,
            message: "You are not authroized to reset password for " + role,
            statusCode: 400,
            record: null,
          };
        }
      } else {
        return {
          error: true,
          message: "You are not authroized to reset password for " + role,
          statusCode: 400,
          record: null,
        };
      }
    } catch (errormessage) {
      return {
        error: true,
        message: errormessage,
        statusCode: 400,
        record: null,
      };
    }
  }
  async login(body) {
    try {
      let username = body.username;
      let userExists = await this.getOne({ username: username });
      if (userExists.error) {
        return {
          error: true,
          message: "Credentials do not match our records",
          statusCode: 200,
          record: null,
        };
      }
      if (
        userExists.record.status === "Verified" ||
        userExists.record.status === "Reset"
      ) {
        const match = await bcrypt.compare(
          body.password,
          userExists.record.password
        );
        if (match) {
          const payload = {
            id: userExists.record._id,
            role: userExists.record.role,
            fullName: userExists.record.fullName,
          };
          const token = jwt.sign(payload, process.env.MY_SECRET);
          return {
            error: false,
            message: "User loggedin successfully!",
            statusCode: 200,
            token: token,
            role: userExists.record.role,
          };
        } else {
          return {
            error: true,
            message: "Credentials do not match our records",
            statusCode: 200,
            record: null,
          };
        }
      } else {
        return {
          error: true,
          message: "Unverified or Suspended Account, Contact your Admin",
          statusCode: 200,
          record: null,
        };
      }
    } catch (error) {
      return {
        error: true,
        message: error,
        statusCode: 500,
        record: null,
      };
    }
  }
  async imageUpload(req, res, next) {
    try {
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "uploads/img");
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
        },
      });

      let upload = multer({
        storage: storage,
        fileFilter: imageValidator,
      }).single("profileImg");

      upload(req, res, function (err) {
        if (req.fileValidationError) {
          return res
            .status(200)
            .send({ error: true, message: " Incorrect File Format" });
        } else if (!req.file) {
          return res.status(200).send({
            error: true,
            message: " Please select an image to upload",
          });
        } else if (err) {
          return res
            .status(200)
            .send({ error: true, message: " Internal Error" });
        }
        req.body.profileImg = req.file.filename;
        next();
      });
    } catch (error) {
      return res.status(400).send({ error: true, message: " Internal Error" });
    }
  }
}

export default UserService;
