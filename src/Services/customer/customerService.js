import CrudService from "../../lib/crud";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
import { imageValidator } from "../../validators/Joi/fileValidator";
import multer from "multer";
class UserService extends CrudService {
  constructor(model) {
    super(model);
  }
  async register(req) {
    try {
      let message = "";
      let body = req.body;
      let { tinNumber, licenseNumber } = body;
      let tinExist = await this.getByField({ tinNumber: tinNumber });
      if (!tinExist.error) {
        message = "Tin Number,";
      }
      let licenseExist = await this.getByField({
        licenseNumber: licenseNumber,
      });
      if (!licenseExist.error) {
        if (message === "") {
          message = " License Number ";
        } else {
          message = message + " and License Number ";
        }
      }
      if (message !== "") {
        message =
          "A company with the provided " + message + "is already registered";
        return {
          error: true,
          message: message,
          statusCode: 200,
          record: null,
        };
      } else {
        body.priority = { priorityNumber: req.body.priority };
        body.paymentMethod = { method: req.body.payment };
        body.log = { actor: req.log.actor, activity: req.log.activity };
        let record = await this.create(body);
        return record;
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
  async updateRegistration(req) {
    try {
      let message = "";
      let body = req.body;
      let id = req.params.id;
      let tinlicenseExist = await this.getById(id);
      let { tinNumber, licenseNumber } = body;
      if (
        tinlicenseExist.record.tinNumber == tinNumber &&
        tinlicenseExist.record.licenseNumber == licenseNumber
      ) {
        let record = await this.update(id, req.body);
        await this.updateByAddSet(id, {
          log: { actor: req.log.actor, activity: req.log.activity },
        });
        return record;
      } else {
        let tinExist = await this.getByField({ tinNumber: tinNumber });
        if (!tinExist.error && tinlicenseExist.record.tinNumber !== tinNumber) {
          message = "Tin Number,";
        }
        let licenseExist = await this.getByField({
          licenseNumber: licenseNumber,
        });
        if (
          !licenseExist.error &&
          tinlicenseExist.record.licenseNumber !== licenseNumber
        ) {
          if (message === "") {
            message = " License Number ";
          } else {
            message = message + " and License Number ";
          }
        }
        if (message !== "") {
          message =
            "A company with the provided " + message + "is already registered";
          return {
            error: true,
            message: message,
            statusCode: 200,
            record: null,
          };
        } else {
          let record = await this.update(id, req.body);
          await this.updateByAddSet(id, {
            log: { actor: req.log.actor, activity: req.log.activity },
          });
          return record;
        }
      }
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async registerAddress(req) {
    try {
      let id = req.params.id;
      let record = await this.updateByAddSet(id, { address: req.body });
      await this.updateByAddSet(id, {
        log: { actor: req.log.actor, activity: req.log.activity },
      });
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async updateAddress(req) {
    try {
      let id = req.params.id;
      let addressId = req.query.addressId;
      let record = await this.updateBySet(
        { _id: id, "address._id": addressId },
        {
          "address.$": req.body,
        }
      );
      await this.updateByAddSet(id, {
        log: { actor: req.log.actor, activity: req.log.activity },
      });
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async requestPaymentMethodChange(req) {
    try {
      let id = req.params.id;
      req.body.status = "Change Requested";
      req.body.log = req.log;
      let record = await this.updateByAddSet(id, {
        paymentMethod: req.body,
      });
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async verifyPaymentMethodChange(req) {
    try {
      let id = req.params.id;
      let paymentId = req.query.paymentId;
      if (req.body.status == "Active") {
        await this.addByPush(
          { _id: id, "paymentMethod.status": "Active" },
          {
            "paymentMethod.$.log": req.log,
          }
        );
        await this.updateBySet(
          { _id: id, "paymentMethod.status": "Active" },
          {
            "paymentMethod.$.status": "Inactive",
          }
        );
      }
      let record = await this.updateBySet(
        { _id: id, "paymentMethod._id": paymentId },
        {
          "paymentMethod.$.status": req.body.status,
        }
      );
      await this.addByPush(
        { "paymentMethod._id": paymentId },
        {
          "paymentMethod.$.log": req.log,
        }
      );
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async requestPriorityChange(req) {
    try {
      let id = req.params.id;
      req.body.status = "Change Requested";
      req.body.log = req.log;
      let record = await this.updateByAddSet(id, {
        priority: req.body,
      });
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async verifyPriorityChange(req) {
    try {
      let id = req.params.id;
      let priorityId = req.query.priorityId;
      if (req.body.status == "Active") {
        await this.addByPush(
          { _id: id, "priority.status": "Active" },
          {
            "priority.$.log": req.log,
          }
        );
        await this.updateBySet(
          { _id: id, "priority.status": "Active" },
          {
            "priority.$.status": "Inactive",
          }
        );
      }
      let record = await this.updateBySet(
        { _id: id, "priority._id": priorityId },
        {
          "priority.$.status": req.body.status,
        }
      );

      await this.addByPush(
        { "priority._id": priorityId },
        {
          "priority.$.log": req.log,
        }
      );
      return record;
    } catch (errormessage) {
      return {
        error: true,
        message: "Please insert all necessary fields correctly",
        statusCode: 400,
        record: null,
      };
    }
  }
  async accountCreate(req) {
    try {
      let message = "";
      let body = req.body;
      let id = req.params.id;
      let { username, email } = body;
      let usernameExist = await this.getByField({ username: username });
      if (!usernameExist.error) {
        message = message + " username, ";
      }
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
        body.password = await bcrypt.hashSync(body.password, 8);
        let record = await this.update(id, body);
        await this.updateByAddSet(id, {
          log: { actor: req.log.actor, activity: req.log.activity },
        });
        return record;
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
      let record = await this.update(id, req.body);
      await this.updateByAddSet(id, {
        log: { actor: req.log.actor, activity: req.log.activity },
      });
      return record;
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
      let userExists = await this.getOne({ username: username }, { log: 0 });
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
            role: "Customer",
            fullName: userExists.record.fullName,
          };
          const token = jwt.sign(payload, process.env.MY_SECRET);
          return {
            error: false,
            message: "User loggedin successfully!",
            statusCode: 200,
            token: token,
            customer: userExists.record,
            role: "Customer",
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
